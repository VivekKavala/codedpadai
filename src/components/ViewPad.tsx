'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  Shield,
  Activity,
  Calendar,
  RefreshCw,
  LogIn,
  Link, // Added Link Icon for badge
  User, // Added User Icon for creator display
  X, // <-- ADDED: For edit tabs
  Plus, // <-- ADDED: For edit tabs
} from 'lucide-react';
import { toast } from 'sonner'; // Ensure sonner is imported
import { Button } from '@/components/ui/button'; // Assuming Button is used
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// If using Next.js Link for navigation:
// import Link from 'next/link';

/**
 * ViewPad Component
 * Displays pad content with security controls.
 * Handles protected, private, encrypted, and link-only pads.
 * Increments view count via separate API call.
 */

interface ViewPadProps {
  padId: string; // The main database ID from the URL path
}

// --- UPDATED: Interface for PadFile ---
interface PadFile {
  id: string; // This will be the DB id or a temp client-side id (e.g., "new_...")
  title: string;
  content: string; // This might be encrypted or decrypted
  order: number;
}
// --- END UPDATE ---

// Define a more specific type for the pad data expected from the API
interface PadData {
  id: string;
  customId: string | null;
  title: string;
  // content: string; // --- REMOVED ---
  files: PadFile[]; // --- ADDED ---
  visibility: 'PUBLIC' | 'PROTECTED' | 'PRIVATE';
  encrypted: boolean;
  editPermission: 'ANYONE' | 'ACCESS_KEY';
  linkOnlyAccess: boolean;
  expiresAt: string | null;
  maxViews: number | null;
  burnAfterReading: boolean;
  disableCopy: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  hideCreator: boolean;
  user: { id: string; name: string | null } | null;
  hasPassphrase?: boolean;
  hasEditKey?: boolean;
}

const ViewPad: React.FC<ViewPadProps> = ({ padId }) => {
  // ===== STATE =====
  const [pad, setPad] = useState<PadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Access control
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [authReason, setAuthReason] = useState<'PROTECTED' | 'PRIVATE' | null>(
    null
  );
  const [accessKey, setAccessKey] = useState('');
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Decryption control
  const [requiresDecryptionKey, setRequiresDecryptionKey] = useState(false);
  const [decryptionKey, setDecryptionKey] = useState('');
  // const [decryptedContent, setDecryptedContent] = useState(''); // --- REMOVED ---
  const [decryptedFiles, setDecryptedFiles] = useState<PadFile[]>([]); // --- ADDED ---
  const [activeFileId, setActiveFileId] = useState<string | null>(null); // --- ADDED ---

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  // const [editContent, setEditContent] = useState(''); // --- REMOVED ---
  const [editTitle, setEditTitle] = useState('');
  const [editFiles, setEditFiles] = useState<PadFile[]>([]); // --- ADDED ---
  const [editAccessKey, setEditAccessKey] = useState('');
  const [requiresEditKey, setRequiresEditKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // UI state
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAccessKey, setDeleteAccessKey] = useState('');
  const [viewCounted, setViewCounted] = useState(false);

  // --- ADDED: Get active file helper ---
  const activeFile = isEditing
    ? editFiles.find((f) => f.id === activeFileId)
    : decryptedFiles.find((f) => f.id === activeFileId);
  // --- END ADD ---

  // --- Helper Functions ---
  const getTokenFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('token');
    }
    return null;
  };

  const getEncryptionKeyFromHash = (): string | null => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const keyParam = params.get('key');
      if (keyParam) return keyParam;
      // Fallback to hash (though 'key' param is preferred)
      return window.location.hash.substring(1) || null;
    }
    return null;
  };

  const handleIncrementView = async () => {
    // --- UPDATED: Check decryptedFiles array ---
    if (viewCounted || !pad || decryptedFiles.length === 0 || !isAuthorized)
      return;
    // --- END UPDATE ---
    setViewCounted(true);

    try {
      const response = await fetch(`/api/pads/${padId}/viewed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: getTokenFromUrl() }),
      });

      if (response.status === 403) {
        const data = await response.json();
        console.error('Failed to log view (403):', data.error || 'Forbidden');
        toast.error(
          'Could not verify permission to log view. The link might be invalid.'
        );
        return;
      }

      if (!response.ok && response.status !== 410) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || `Failed to log view - Status: ${response.status}`
        );
      }

      const data = await response.json();
      if (response.status === 410) {
        setError(data.error || 'This pad has been deleted after viewing.');
        toast.error(data.error || 'This pad has been deleted after viewing.');
        setDecryptedFiles([]); // --- ADDED ---
        setPad(null);
      }
    } catch (err: any) {
      console.error('Error during view logging:', err.message || err);
    }
  };

  const decryptContent = (
    encryptedContent: string,
    key: string
  ): string | null => {
    try {
      // Placeholder for real AES encryption
      const decoded = atob(encryptedContent);
      // Check for empty string, as atob("") returns ""
      // if (!decoded) throw new Error('Decryption resulted in empty content');
      return decoded;
    } catch (error) {
      console.error('Decryption failed:', error);
      // We toast in the calling function (decryptFiles)
      return null;
    }
  };

  // --- ADDED: Helper to decrypt all files ---
  const decryptFiles = (files: PadFile[], key: string): PadFile[] | null => {
    try {
      const allDecrypted: PadFile[] = [];
      for (const file of files) {
        const decrypted = decryptContent(file.content, key);
        if (decrypted === null) {
          // If any file fails, the whole process fails
          throw new Error(`Failed to decrypt file: ${file.title}`);
        }
        allDecrypted.push({ ...file, content: decrypted });
      }
      return allDecrypted;
    } catch (error) {
      console.error('File decryption process failed:', error);
      toast.error(
        'Decryption failed. The key might be incorrect or some data corrupted.'
      );
      return null;
    }
  };
  // --- END ADD ---

  const fetchPad = async (authKey?: string) => {
    setLoading(true);
    setError('');
    setAuthReason(null);
    setPad(null);
    setDecryptedFiles([]); // --- ADDED ---
    setActiveFileId(null); // --- ADDED ---
    setIsAuthorized(false);

    try {
      const token = getTokenFromUrl();
      // --- UPDATED: Fetch from /api/pads/[id] (POST) ---
      const response = await fetch(`/api/pads/${padId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, accessKey: authKey }),
      });
      // --- END UPDATE ---

      let data;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          data = await response.json();
        } else {
          const textResponse = await response.text();
          console.error('Non-JSON response received:', textResponse);
          throw new Error(
            `Server returned status ${response.status}. Check server logs.`
          );
        }
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        throw new Error(
          `Failed to parse server response (Status: ${response.status}).`
        );
      }

      if (!response.ok) {
        const errorMsg =
          data.error || `Failed to load pad (Status: ${response.status})`;
        setError(errorMsg);
        toast.error(errorMsg);

        if (response.status === 401 && data.requiresAuth) {
          setRequiresAuth(true);
          setAuthReason(data.reason === 'PRIVATE' ? 'PRIVATE' : 'PROTECTED');
        }
        setLoading(false);
        return;
      }

      if (data.linkOnlyAccess && !getTokenFromUrl()) {
        setError('A valid share token is required to view this pad.');
        toast.error('A valid share token is required to view this pad.');
        setLoading(false);
        setIsAuthorized(false);
        setPad(null);
        return;
      }

      // --- ADDED: Check if files array exists ---
      if (!data.files) {
        throw new Error('Pad data is missing file content.');
      }
      // --- END ADD ---

      setPad(data as PadData);
      setRequiresAuth(false);
      setAuthReason(null);
      setIsAuthorized(true);

      // --- UPDATED: Handle file decryption ---
      if (data.encrypted) {
        const encKey = getEncryptionKeyFromHash();
        if (encKey) {
          const decrypted = decryptFiles(data.files, encKey);
          if (decrypted !== null) {
            setDecryptedFiles(decrypted);
            setActiveFileId(decrypted[0]?.id || null);
            setDecryptionKey(encKey);
          } else {
            setError('Failed to decrypt content with the provided key.');
            setRequiresDecryptionKey(true);
            setIsAuthorized(false);
          }
        } else {
          setRequiresDecryptionKey(true);
          setIsAuthorized(false);
        }
      } else {
        // Not encrypted
        setDecryptedFiles(data.files);
        setActiveFileId(data.files[0]?.id || null);
      }
      // --- END UPDATE ---

      if (data.burnAfterReading) {
        console.log('Reminder: This pad is set to burn after reading.');
      }
    } catch (err: any) {
      console.error('fetchPad error:', err);
      const errorMsg = err.message || 'Failed to load pad data.';
      setError(errorMsg);
      setPad(null);
      setDecryptedFiles([]);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
      setIsAuthenticating(false);
    }
  };

  // Trigger view count
  useEffect(() => {
    // --- UPDATED: Check decryptedFiles array ---
    if (
      isAuthorized &&
      decryptedFiles.length > 0 &&
      !viewCounted &&
      pad &&
      !requiresAuth &&
      !requiresDecryptionKey
    ) {
      handleIncrementView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    decryptedFiles, // --- UPDATED ---
    viewCounted,
    pad,
    requiresAuth,
    requiresDecryptionKey,
    isAuthorized,
  ]);

  // Handle Access Key Submission
  const submitAuth = () => {
    if (authReason !== 'PROTECTED' || !accessKey.trim()) return;
    setIsAuthenticating(true);
    fetchPad(accessKey);
  };

  // Handle Decryption Key Submission
  const handleSubmitDecryption = () => {
    if (!decryptionKey.trim() || !pad?.files) {
      toast.info('Please enter a decryption key.');
      return;
    }
    // --- UPDATED: Decrypt all files ---
    const decrypted = decryptFiles(pad.files, decryptionKey);
    if (decrypted !== null) {
      setDecryptedFiles(decrypted);
      setActiveFileId(decrypted[0]?.id || null);
      setRequiresDecryptionKey(false);
      setError('');
      toast.success('Content decrypted successfully!');
      setIsAuthorized(true);
    } else {
      setError('Failed to decrypt content. Invalid decryption key.');
      setIsAuthorized(false);
    }
    // --- END UPDATE ---
  };

  const copyToClipboard = (text: string | undefined) => {
    if (pad?.disableCopy) {
      toast.error('Copying is disabled for this pad');
      return;
    }
    if (text === undefined || text === null) {
      toast.info('Nothing to copy.');
      return;
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('Failed to copy.');
      }
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback copy error:', err);
      toast.error('Failed to copy.');
    }
  };

  const downloadContent = () => {
    // --- UPDATED: Download active file ---
    if (activeFile === undefined || activeFile.content === null) {
      toast.info('No content in the active tab to download.');
      return;
    }
    try {
      const blob = new Blob([activeFile.content], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName =
        activeFile.title.replace(/[^a-z0-9._-]/gi, '_') || 'file';
      a.download = `${fileName || pad?.title || 'pad'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Download started!');
      // --- END UPDATE ---
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to initiate download.');
    }
  };

  const handleEdit = () => {
    if (!pad) return;
    if (pad.editPermission === 'ACCESS_KEY') {
      setRequiresEditKey(true);
    }
    setIsEditing(true);
    setEditTitle(pad.title || '');
    // --- UPDATED: Set editFiles to a deep copy of decryptedFiles ---
    setEditFiles(structuredClone(decryptedFiles));
    // Ensure activeFileId is set
    if (!activeFileId && decryptedFiles.length > 0) {
      setActiveFileId(decryptedFiles[0].id);
    }
    // --- END UPDATE ---
  };

  // --- ADDED: Handlers for editing files ---
  const handleEditFileTitleChange = (id: string, newTitle: string) => {
    setEditFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id ? { ...file, title: newTitle } : file
      )
    );
  };

  const handleEditFileContentChange = (id: string, newContent: string) => {
    setEditFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id ? { ...file, content: newContent } : file
      )
    );
  };

  const handleEditAddFile = () => {
    const newFile: PadFile = {
      id: `new_${crypto.randomUUID()}`,
      title: `Tab ${editFiles.length + 1}`,
      content: '',
      order: editFiles.length, // Order will be re-calculated on save
    };
    setEditFiles([...editFiles, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleEditRemoveFile = (idToRemove: string) => {
    if (editFiles.length <= 1) {
      toast.error('You must have at least one file.');
      return;
    }
    const newFiles = editFiles.filter((f) => f.id !== idToRemove);
    setEditFiles(newFiles); // Order will be re-calculated on save

    // If active tab was deleted, switch to the first available
    if (activeFileId === idToRemove) {
      setActiveFileId(newFiles[0]?.id || null);
    }
  };
  // --- END ADD ---

  const handleSave = async () => {
    if (!pad) return;
    // --- UPDATED: Validate editFiles ---
    if (editFiles.some((f) => !f.title.trim())) {
      toast.error('All tabs must have a title.');
      return;
    }
    // Note: We allow empty content
    // if (editFiles.some((f) => !f.content.trim())) {
    //   toast.error('Content cannot be empty in any file.');
    //   return;
    // }
    // --- END UPDATE ---
    if (pad.editPermission === 'ACCESS_KEY' && !editAccessKey.trim()) {
      setError('An Edit Access Key is required to save changes.');
      toast.error('An Edit Access Key is required to save changes.');
      setRequiresEditKey(true);
      return;
    }
    setIsSaving(true);
    setError('');

    // --- UPDATED: Re-encrypt files if needed ---
    let filesToSave: PadFile[] = [];
    if (pad.encrypted) {
      try {
        filesToSave = editFiles.map((file) => {
          // Placeholder for real encryption
          const encryptedContent = btoa(file.content);
          return { ...file, content: encryptedContent };
        });
      } catch (e) {
        toast.error('Failed to re-encrypt content.');
        setIsSaving(false);
        return;
      }
    } else {
      filesToSave = editFiles; // Send plain text
    }

    // Map files to API format (handle temp IDs, re-calculate order)
    const apiFiles = filesToSave.map((file, index) => ({
      id: file.id, // Send the ID (temp or real)
      title: file.title,
      content: file.content,
      order: index, // Set correct order
    }));
    // --- END UPDATE ---

    try {
      // --- UPDATED: Send to the correct update route ---
      const response = await fetch(`/api/pads/${padId}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: apiFiles, // --- FIXED ---
          title: editTitle,
          editAccessKey: editAccessKey || undefined,
        }),
      });
      // --- END UPDATE ---

      const contentType = response.headers.get('content-type');
      if (!contentType || contentType.indexOf('application/json') === -1) {
        const textResponse = await response.text();
        console.error('Non-JSON response on save:', textResponse);
        throw new Error(`Server returned status ${response.status}.`);
      }
      const data = await response.json();

      if (response.status === 401 && data.requiresEditKey) {
        setRequiresEditKey(true);
        setError(data.error || 'Invalid Edit Access Key.');
        toast.error(data.error || 'Invalid Edit Access Key.');
        setIsSaving(false);
        return;
      }
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update pad');
      }

      // --- UPDATED: Update state correctly ---
      setPad((prevPad) =>
        prevPad
          ? {
              ...prevPad,
              title: editTitle,
              files: filesToSave, // Store the newly saved (and re-encrypted) files
              updatedAt: data.pad.updatedAt,
            }
          : null
      );
      setDecryptedFiles(editFiles); // The edited files are now the source of truth
      // --- END UPDATE ---
      setIsEditing(false);
      setEditAccessKey('');
      setRequiresEditKey(false);
      toast.success('Pad updated successfully!');
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update pad';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (pad?.editPermission === 'ACCESS_KEY' && !deleteAccessKey.trim()) {
      setError('An Edit Access Key is required to delete this pad.');
      toast.error('An Edit Access Key is required to delete this pad.');
      setIsDeleting(false);
      return;
    }

    setIsDeleting(true);
    setError('');
    try {
      // --- UPDATED: Send DELETE to /api/pads/[id] ---
      const response = await fetch(`/api/pads/${padId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editAccessKey: deleteAccessKey || undefined, // Send edit key
          token: getTokenFromUrl(),
          accessKey: authReason === 'PROTECTED' ? accessKey : undefined,
        }),
      });
      // --- END UPDATE ---

      const contentType = response.headers.get('content-type');
      if (!contentType || contentType.indexOf('application/json') === -1) {
        const textResponse = await response.text();
        console.error('Non-JSON response on delete:', textResponse);
        throw new Error(`Server returned status ${response.status}.`);
      }
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError(data.error || 'Authorization failed.');
          toast.error(data.error || 'Authorization failed.');
          setIsDeleting(false);
          return;
        }
        throw new Error(data.error || 'Failed to delete pad');
      }
      toast.success('Pad deleted successfully!');
      window.location.href = '/';
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to delete pad';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsDeleting(false);
    }
  };

  const getTimeRemaining = (expiresAt: string | null): string => {
    if (!expiresAt) return '';
    try {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) return 'Expired';

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
      if (hours > 0) return `${hours}h ${minutes}m remaining`;
      if (minutes > 0) return `${minutes}m remaining`;
      return 'Less than a minute remaining';
    } catch (e) {
      console.error('Error parsing expiresAt date:', expiresAt, e);
      return 'Invalid date';
    }
  };

  // Initial load
  useEffect(() => {
    fetchPad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padId]);

  // ===== RENDER LOGIC =====

  // --- ACCESS REQUIRED VIEW ---
  if (requiresAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {authReason === 'PRIVATE' ? (
                <Shield className="w-8 h-8 text-indigo-600" />
              ) : (
                <Lock className="w-8 h-8 text-indigo-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {authReason === 'PRIVATE' ? 'Private Pad' : 'Protected Pad'}
            </h2>
            {authReason === 'PRIVATE' ? (
              <p className="text-gray-600">
                This is a private pad. Please log in with the account that
                created it to view the content.
              </p>
            ) : (
              <p className="text-gray-600">
                This pad requires an access key to view.
              </p>
            )}
          </div>

          {authReason === 'PROTECTED' && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="access-key-input"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Access Key
                </Label>
                <div className="relative">
                  <Input
                    id="access-key-input"
                    type={showAccessKey ? 'text' : 'password'}
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitAuth()}
                    placeholder="Enter access key"
                    className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessKey(!showAccessKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showAccessKey ? 'Hide key' : 'Show key'}
                  >
                    {showAccessKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="button"
                onClick={submitAuth}
                disabled={isAuthenticating || !accessKey.trim()}
                className="w-full"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" /> Unlock Pad
                  </>
                )}
              </Button>
            </div>
          )}

          {authReason === 'PRIVATE' && (
            <div className="mt-6">
              <Button asChild className="w-full">
                <a href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Go to Login
                </a>
              </Button>
            </div>
          )}

          {error && authReason === 'PROTECTED' && (
            <div className="mt-4 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DECRYPTION KEY REQUIRED VIEW ---
  if (requiresDecryptionKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pad is Encrypted
            </h2>
            <p className="text-gray-600">
              Enter the decryption key to view this pad's content.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="decryption-key-input"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Decryption Key
              </Label>
              <div className="relative">
                <Input
                  id="decryption-key-input"
                  type={showAccessKey ? 'text' : 'password'}
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && handleSubmitDecryption()
                  }
                  placeholder="Enter decryption key"
                  className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAccessKey(!showAccessKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showAccessKey ? 'Hide key' : 'Show key'}
                >
                  {showAccessKey ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleSubmitDecryption}
              disabled={!decryptionKey.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Shield className="mr-2 h-4 w-4" /> Decrypt Content
            </Button>
          </div>
          {error && (
            <div className="mt-4 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading pad...</p>
        </div>
      </div>
    );
  }

  // --- ERROR VIEW (if fetch failed and pad is null) ---
  if (!pad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Pad
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'The pad could not be loaded or may not exist.'}
          </p>
          <Button asChild>
            <a href="/">Go Home</a>
          </Button>
        </div>
      </div>
    );
  }

  // ===== MAIN PAD VIEW =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start justify-between mb-4">
            {/* Title and Metadata */}
            <div className="flex-1 mb-4 md:mb-0 md:pr-4">
              {isEditing ? (
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-indigo-500 focus:outline-none w-full mb-3"
                  placeholder="Untitled Pad"
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words mb-3">
                  {pad.title || 'Untitled Pad'}
                </h1>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1.5" title="Creator">
                  <User className="w-4 h-4" />
                  {pad.hideCreator
                    ? 'Anonymous'
                    : pad.user?.name || 'Anonymous'}
                </span>
                <span className="flex items-center gap-1.5" title="Views">
                  <Eye className="w-4 h-4" />
                  {pad.views} view{pad.views !== 1 ? 's' : ''}
                </span>
                {pad.createdAt && (
                  <span
                    className="flex items-center gap-1.5"
                    title={`Created: ${new Date(pad.createdAt).toLocaleString()}`}
                  >
                    <Calendar className="w-4 h-4" />
                    {new Date(pad.createdAt).toLocaleDateString()}
                  </span>
                )}
                {pad.updatedAt && pad.updatedAt !== pad.createdAt && (
                  <span
                    className="flex items-center gap-1.5"
                    title={`Updated: ${new Date(pad.updatedAt).toLocaleString()}`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {new Date(pad.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {!isEditing && isAuthorized && (
                <>
                  <Button
                    onClick={downloadContent}
                    variant="ghost"
                    size="icon"
                    title="Download Active Tab"
                  >
                    <Download className="w-5 h-5" />
                  </Button>

                  <Button
                    onClick={handleEdit}
                    variant="ghost"
                    size="icon"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>

                  {(pad.editPermission === 'ANYONE' ||
                    pad.visibility === 'PRIVATE' ||
                    pad.editPermission === 'ACCESS_KEY') && (
                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                pad.visibility === 'PUBLIC'
                  ? 'bg-green-100 text-green-800'
                  : pad.visibility === 'PROTECTED'
                    ? 'bg-yellow-100 text-yellow-800'
                    : pad.visibility === 'PRIVATE'
                      ? 'bg-red-100 text-red-800'
                      : ''
              }`}
            >
              {pad.visibility === 'PROTECTED' && <Lock className="w-3 h-3" />}
              {pad.visibility === 'PRIVATE' && <Shield className="w-3 h-3" />}
              {pad.visibility}
            </span>
            {pad.encrypted && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                <Lock className="w-3 h-3" /> Encrypted
              </span>
            )}
            {pad.linkOnlyAccess && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <Link className="w-3 h-3" /> Link Required
              </span>
            )}
            {pad.burnAfterReading && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                🔥 Burn After Reading
              </span>
            )}
            {pad.disableCopy && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                <Copy className="w-3 h-3" /> Copy Disabled
              </span>
            )}
          </div>

          {(pad.expiresAt || pad.maxViews) && (
            <div
              className={`mt-4 border rounded-lg p-3 flex items-start gap-2 text-sm ${
                pad.expiresAt
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
                  : pad.maxViews
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : ''
              }`}
            >
              {(pad.expiresAt || pad.maxViews) && (
                <div className="flex-shrink-0 mt-0.5">
                  {pad.expiresAt && (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  )}
                  {!pad.expiresAt && pad.maxViews && (
                    <Activity className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              )}
              <div>
                {pad.expiresAt && (
                  <p className="font-semibold">Expiry Notice</p>
                )}
                {!pad.expiresAt && pad.maxViews && (
                  <p className="font-semibold">View Limit</p>
                )}

                {pad.expiresAt && <p>{getTimeRemaining(pad.expiresAt)}</p>}
                {pad.maxViews && (!pad.expiresAt || pad.expiresAt) && (
                  <p>
                    {pad.views} / {pad.maxViews} views used
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
          {!isEditing && (
            <Button
              onClick={() => copyToClipboard(activeFile?.content)} // --- UPDATED ---
              disabled={pad.disableCopy}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 flex items-center gap-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed z-10"
              title={
                pad.disableCopy
                  ? 'Copying disabled'
                  : 'Copy content from active tab'
              } // --- UPDATED ---
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </Button>
          )}

          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-200 pr-20">
            {isEditing ? 'Edit Content' : 'Pad Content'}
          </h2>

          {/* --- TABS & CONTENT AREA (REBUILT) --- */}
          {isEditing ? (
            // ===== EDITING VIEW =====
            <div className="space-y-4">
              {/* Edit Tab Bar */}
              <div className="flex items-center border-b border-gray-300 mb-2 overflow-x-auto">
                {editFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center border-b-2 -mb-px ${
                      activeFileId === file.id
                        ? 'border-indigo-600'
                        : 'border-transparent'
                    }`}
                  >
                    {/* Tab Title Input */}
                    <Input
                      type="text"
                      value={file.title}
                      onChange={(e) =>
                        handleEditFileTitleChange(file.id, e.target.value)
                      }
                      onFocus={() => setActiveFileId(file.id)} // <-- BUG FIX ADDED
                      className="py-3 px-2 h-auto text-sm font-medium border-0 border-transparent focus:ring-0 focus:border-indigo-600 focus:bg-indigo-50 rounded-none min-w-[100px]"
                      placeholder="Tab Title"
                    />
                    <button
                      type="button"
                      onClick={() => handleEditRemoveFile(file.id)}
                      className={`p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 ${
                        editFiles.length <= 1 ? 'hidden' : 'inline-flex'
                      }`}
                      aria-label="Remove tab"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleEditAddFile}
                  className="p-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-t-lg"
                  aria-label="Add new tab"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Edit Textarea */}
              <textarea
                value={activeFile?.content || ''}
                onChange={(e) => {
                  if (activeFile) {
                    handleEditFileContentChange(activeFile.id, e.target.value);
                  }
                }}
                rows={15}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm resize-y max-h-[75vh]"
                placeholder="Enter content for this tab..."
              />

              {requiresEditKey && (
                <div>
                  <Label
                    htmlFor="edit-key-input"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Edit Access Key Required
                  </Label>
                  <Input
                    id="edit-key-input"
                    type="password"
                    value={editAccessKey}
                    onChange={(e) => setEditAccessKey(e.target.value)}
                    placeholder="Enter edit access key"
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              )}

              {error && !isSaving && (
                <div className="text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditAccessKey('');
                    setRequiresEditKey(false);
                    setError('');
                  }}
                  disabled={isSaving}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // ===== VIEWING VIEW =====
            <div>
              {/* View Tab Bar */}
              <div className="flex items-center border-b border-gray-300 mb-4 overflow-x-auto">
                {decryptedFiles.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setActiveFileId(file.id)}
                    className={`py-3 px-4 text-sm font-medium border-b-2 -mb-px ${
                      activeFileId === file.id
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {file.title || 'Untitled'}
                  </button>
                ))}
              </div>

              {/* View Content Area */}
              <pre
                className={`whitespace-pre-wrap text-sm leading-relaxed font-mono bg-gray-50 text-gray-900 rounded-lg p-4 sm:p-6 ${pad.disableCopy ? 'select-none' : ''} max-h-[75vh] overflow-y-auto`}
                style={
                  pad.disableCopy
                    ? { userSelect: 'none', WebkitUserSelect: 'none' }
                    : {}
                }
              >
                {activeFile?.content ?? // Use nullish coalescing
                  (pad?.encrypted
                    ? 'Processing encrypted content...'
                    : 'Loading content...')}
              </pre>
            </div>
          )}
          {/* --- END TABS & CONTENT AREA --- */}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Delete Pad?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    This action cannot be undone. The pad will be permanently
                    deleted.
                  </p>
                </div>
              </div>

              {pad?.editPermission === 'ACCESS_KEY' && (
                <div className="mt-4">
                  <Label
                    htmlFor="delete-key-input"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Edit Access Key Required
                  </Label>
                  <Input
                    id="delete-key-input"
                    type="password"
                    value={deleteAccessKey}
                    onChange={(e) => setDeleteAccessKey(e.target.value)}
                    placeholder="Enter edit access key to confirm"
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              )}

              {error && (
                <div className="mt-4 text-sm text-red-600 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  variant="destructive"
                  className="flex-1"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Yes, Delete'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setError('');
                    setDeleteAccessKey('');
                  }}
                  disabled={isDeleting}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPad;
