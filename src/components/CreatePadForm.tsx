'use client';

import React, { useState, useEffect } from 'react';
// Assuming these are shadcn/ui components.
// Make sure you have these components in your project.
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { QRCodeCanvas } from 'qrcode.react';
import {
  Eye,
  EyeOff,
  Lock,
  Globe,
  Shield,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  QrCode,
  Clock,
  Activity,
  AlertCircle,
  List,
  ListX,
  UserX,
  UserCheck,
  SearchCheck,
  Download,
  Plus, // <-- ADDED
  X, // <-- ADDED
  FileText, // <-- ADDED
} from 'lucide-react';
import { toast } from 'sonner'; // Assuming sonner is installed

interface CreatePadFormProps {
  userId: string | null; // Accept userId from the page
}

// --- ADDED: Type for a single file/tab ---
interface PadFile {
  id: string; // Temporary client-side ID
  title: string;
  content: string;
  order: number;
}
// --- END ADD ---

// Define type for the public sharing selection UI
type PublicSharingOption = 'listAndShow' | 'listAndHide' | 'unlistAndAnonymous';
// Define type for the *final* anonymity status stored and displayed
type AnonymityChoice = 'linked' | 'publicly_anonymous' | 'completely_anonymous';

const CreatePadForm: React.FC<CreatePadFormProps> = ({ userId }) => {
  const isAuthenticated = !!userId;
  const MAX_CONTENT_LENGTH = 500000; // Max character limit PER FILE

  // ===== BASIC FORM STATE =====
  const [title, setTitle] = useState('');
  // const [content, setContent] = useState(''); // --- REMOVED ---
  const [customId, setCustomId] = useState('');
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);

  // --- UPDATED: State for multi-file tabs ---
  const [files, setFiles] = useState<PadFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // For hydration fix

  // --- Hydration Fix: Initialize files on client ---
  useEffect(() => {
    const initialFileId = `temp_${crypto.randomUUID()}`;
    setFiles([
      {
        id: initialFileId,
        title: 'Tab 1',
        content: '',
        order: 1,
      },
    ]);
    setActiveFileId(initialFileId);
    setIsClient(true); // Mark client as hydrated
  }, []);
  // --- END Hydration Fix ---

  // Get active file for convenience
  const activeFile = files.find((f) => f.id === activeFileId);
  // --- END UPDATE ---

  // ===== PRIVACY SETTINGS =====
  const [visibility, setVisibility] = useState<
    'PUBLIC' | 'PROTECTED' | 'PRIVATE'
  >('PUBLIC');
  const [isListed, setIsListed] = useState(true); // Still used for non-logged-in public pads
  const [accessKey, setAccessKey] = useState('');
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [publicSharingOption, setPublicSharingOption] =
    useState<PublicSharingOption>('listAndShow'); // UI state for public pads

  // ===== EDITING PERMISSIONS =====
  const [editPermission, setEditPermission] = useState<'ANYONE' | 'ACCESS_KEY'>(
    'ANYONE'
  );
  const [editAccessKey, setEditAccessKey] = useState('');

  // ===== ADVANCED FEATURES STATE =====
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [enableEncryption, setEnableEncryption] = useState(false);
  const [linkOnlyAccess, setLinkOnlyAccess] = useState(false); // The single merged flag
  const [expiryType, setExpiryType] = useState<
    'NONE' | 'TIME' | 'VIEWS' | 'ONE_TIME'
  >('NONE');
  const [expiryValue, setExpiryValue] = useState('24');
  const [expiryUnit, setExpiryUnit] = useState<'HOURS' | 'DAYS'>('HOURS');
  const [maxViews, setMaxViews] = useState('10');
  const [disableCopy, setDisableCopy] = useState(false);
  const [generateLink, setGenerateLink] = useState(true);
  const [enableAuditLogs, setEnableAuditLogs] = useState(false);
  const [notifyOnView, setNotifyOnView] = useState(false);

  // ===== SUBMISSION & UI STATE =====
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdPad, setCreatedPad] = useState<any>(null); // Holds API response + constructed shareUrl
  const [copiedLink, setCopiedLink] = useState<false | 'uuid' | 'custom'>(
    false
  );

  // Reset public sharing options and edit permissions based on visibility and auth status
  useEffect(() => {
    if (!isAuthenticated || visibility !== 'PUBLIC') {
      setPublicSharingOption('listAndShow');
      setIsListed(visibility === 'PUBLIC');
    } else {
      setPublicSharingOption('listAndShow');
      setIsListed(true);
    }

    if (visibility === 'PRIVATE') {
      setEditPermission('ANYONE');
      setEditAccessKey('');
    }

    if (!isAuthenticated) {
      setEnableAuditLogs(false);
    }
  }, [visibility, isAuthenticated]);

  // --- Helper functions ---
  const checkIdAvailability = async () => {
    if (!customId.trim()) {
      setIdAvailable(null);
      return;
    }
    setIsCheckingId(true);
    try {
      const response = await fetch(
        `/api/pads/check-id?id=${encodeURIComponent(customId)}`
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setIdAvailable(data.available);
    } catch (err) {
      console.error('Error checking ID:', err);
      setIdAvailable(null);
      toast.error('Could not check ID availability.');
    } finally {
      setIsCheckingId(false);
    }
  };
  const generateRandomId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomId(id);
    setIdAvailable(null);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (customId) checkIdAvailability();
      else setIdAvailable(null);
    }, 500);
    return () => clearTimeout(timer);
  }, [customId]);
  const encryptContent = (text: string, key: string): string => btoa(text);

  // --- ADDED: Handlers for file tabs ---
  const handleFileTitleChange = (id: string, newTitle: string) => {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id ? { ...file, title: newTitle } : file
      )
    );
  };

  const handleFileContentChange = (id: string, newContent: string) => {
    // Enforce max length
    if (newContent.length > MAX_CONTENT_LENGTH) {
      toast.error(
        `Content for "${
          files.find((f) => f.id === id)?.title
        }" must be ${MAX_CONTENT_LENGTH.toLocaleString()} characters or less.`,
        { duration: 2000 }
      );
      // Truncate the content
      newContent = newContent.substring(0, MAX_CONTENT_LENGTH);
    }

    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id ? { ...file, content: newContent } : file
      )
    );
  };

  const addFile = () => {
    const newFileId = `temp_${crypto.randomUUID()}`;
    const newFile: PadFile = {
      id: newFileId,
      title: `Tab ${files.length + 1}`,
      content: '',
      order: files.length + 1,
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFileId);
  };

  const removeFile = (e: React.MouseEvent, idToRemove: string) => {
    e.stopPropagation(); // <-- Prevent tab selection
    if (files.length <= 1) {
      toast.error('You must have at least one file.');
      return;
    }
    const newFiles = files.filter((f) => f.id !== idToRemove);
    // Re-order
    const reorderedFiles = newFiles.map((f, index) => ({
      ...f,
      order: index + 1,
    }));
    setFiles(reorderedFiles);

    if (activeFileId === idToRemove) {
      setActiveFileId(reorderedFiles[0]?.id || null);
    }
  };
  // --- END ADD ---

  const validateForm = (): string | null => {
    // --- UPDATED: Validate files ---
    if (files.some((f) => !f.content.trim())) {
      return 'Content is required in all tabs.';
    }
    if (files.some((f) => !f.title.trim())) {
      return 'All tabs must have a title.';
    }
    if (files.some((f) => f.content.length > MAX_CONTENT_LENGTH)) {
      return `Content in one or more tabs exceeds the ${MAX_CONTENT_LENGTH.toLocaleString()} character limit.`;
    }
    // --- END UPDATE ---

    if (customId && idAvailable === false) return 'Custom ID is not available';
    if (visibility === 'PRIVATE' && !isAuthenticated)
      return 'You must be logged in to create a private pad.';
    if (visibility === 'PROTECTED' && !accessKey)
      return 'Access key is required for protected pads';
    if (
      visibility !== 'PRIVATE' &&
      editPermission === 'ACCESS_KEY' &&
      !editAccessKey
    ) {
      return 'Edit access key is required';
    }
    if (enableAuditLogs && !isAuthenticated) {
      return 'Login required to enable audit logs.';
    }
    if (expiryType === 'TIME' && (!expiryValue || parseInt(expiryValue) <= 0))
      return 'Invalid expiry time';
    if (expiryType === 'VIEWS' && (!maxViews || parseInt(maxViews) <= 0))
      return 'Invalid view count';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      // --- UPDATED: Handle file encryption ---
      let finalFiles = files;
      let encryptionKey = '';
      if (enableEncryption) {
        encryptionKey = Math.random().toString(36).substring(2, 15);
        finalFiles = files.map((file) => ({
          ...file,
          content: encryptContent(file.content, encryptionKey),
        }));
      }
      // --- END UPDATE ---

      let expiresAt = null;
      if (expiryType === 'TIME') {
        const hours =
          expiryUnit === 'HOURS'
            ? parseInt(expiryValue)
            : parseInt(expiryValue) * 24;
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      }

      let finalUserId: string | undefined = undefined;
      let finalHideCreator = false;
      let finalIsListed = false;
      let finalAnonymityChoice: AnonymityChoice = 'completely_anonymous';
      let finalEditPermission =
        visibility === 'PRIVATE' ? 'ANYONE' : editPermission;
      let finalEditAccessKey =
        visibility === 'PRIVATE'
          ? undefined
          : editPermission === 'ACCESS_KEY'
            ? editAccessKey
            : undefined;
      let finalEnableAuditLogs = isAuthenticated && enableAuditLogs;

      if (visibility === 'PUBLIC') {
        if (isAuthenticated) {
          if (publicSharingOption === 'listAndShow') {
            finalAnonymityChoice = 'linked';
            finalUserId = userId ?? undefined;
            finalHideCreator = false;
            finalIsListed = true;
          } else if (publicSharingOption === 'listAndHide') {
            finalAnonymityChoice = 'publicly_anonymous';
            finalUserId = userId ?? undefined;
            finalHideCreator = true;
            finalIsListed = true;
          } else {
            // 'unlistAndAnonymous'
            finalAnonymityChoice = 'completely_anonymous';
            finalUserId = undefined;
            finalHideCreator = true;
            finalIsListed = false;
          }
        } else {
          finalUserId = undefined;
          finalHideCreator = true;
          finalIsListed = isListed;
          finalAnonymityChoice = 'completely_anonymous';
        }
      } else {
        finalIsListed = false;
        if (visibility === 'PRIVATE' && isAuthenticated) {
          finalUserId = userId ?? undefined;
          finalHideCreator = false;
          finalAnonymityChoice = 'linked';
        } else {
          // PROTECTED or (PRIVATE and not logged in)
          finalUserId = undefined;
          finalHideCreator = true;
          finalAnonymityChoice = 'completely_anonymous';
        }
      }

      // --- UPDATED: Prepare files for API ---
      const apiFiles = finalFiles.map((file, index) => ({
        title: file.title,
        content: file.content,
        order: index + 1, // Ensure order is correct on submission
      }));
      // --- END UPDATE ---

      const payload = {
        title: title.trim() || 'Untitled Pad',
        // content: finalContent, // --- REMOVED ---
        files: apiFiles, // --- ADDED ---
        customId: customId.trim() || undefined,
        visibility,
        isListed: finalIsListed,
        accessKey: visibility === 'PROTECTED' ? accessKey : undefined,
        editPermission: finalEditPermission,
        editAccessKey: finalEditAccessKey,
        encrypted: enableEncryption,
        linkOnlyAccess,
        expiresAt,
        maxViews: expiryType === 'VIEWS' ? parseInt(maxViews) : undefined,
        burnAfterReading: expiryType === 'ONE_TIME',
        disableCopy,
        // viewOnlyViaLink removed
        enableAuditLogs: finalEnableAuditLogs,
        notifyOnView: false,
        hideCreator: finalHideCreator,
        userId: finalUserId,
      };
      const response = await fetch('/api/pads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create pad');
      }
      const data = await response.json();
      const returnedPadData = data.pad;
      const returnedId = returnedPadData.id;
      const returnedCustomId = returnedPadData.customId;
      const returnedToken = data.shareToken;

      let shareUrl = `${window.location.origin}/pad/${returnedId}`;
      if (returnedToken) {
        shareUrl += `?token=${returnedToken}`;
      }
      if (enableEncryption && encryptionKey) {
        shareUrl += `${returnedToken ? '&' : '?'}key=${encryptionKey}`;
      }

      let customShareUrl = '';

      if (returnedCustomId) {
        customShareUrl = `${window.location.origin}/custom/${returnedCustomId}`;
        if (returnedToken) {
          customShareUrl += `?token=${returnedToken}`;
        }
        if (enableEncryption && encryptionKey) {
          customShareUrl += `${returnedToken ? '&' : '?'}key=${encryptionKey}`;
        }
      }

      setCreatedPad({
        ...returnedPadData,
        shareUrl,
        customShareUrl,
        anonymityChoice: finalAnonymityChoice,
      });
      setShowSuccess(true);
      toast.success('Pad created successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'uuid' | 'custom') => {
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
        setCopiedLink(type);
        toast.success('Link copied!');
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        toast.error('Failed to copy link.');
      }
      document.body.removeChild(textArea);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
      toast.error('Failed to copy link.');
    }
  };
  const resetForm = () => {
    setShowSuccess(false);
    setCreatedPad(null);
    setTitle('');
    // setContent(''); // --- REMOVED ---
    setCustomId('');
    setIdAvailable(null);
    setAccessKey('');
    setEditAccessKey('');
    setError('');
    setVisibility('PUBLIC');
    setIsListed(true);
    setPublicSharingOption('listAndShow');
    setEditPermission('ANYONE');
    setShowAdvanced(false);
    setEnableEncryption(false);
    setLinkOnlyAccess(false);
    setExpiryType('NONE');
    setExpiryValue('24');
    setExpiryUnit('HOURS');
    setMaxViews('10');
    setDisableCopy(false);
    setGenerateLink(true);
    setEnableAuditLogs(false);
    setNotifyOnView(false);

    // --- UPDATED: Reset files ---
    const initialFileId = `temp_${crypto.randomUUID()}`;
    setFiles([
      {
        id: initialFileId,
        title: 'Tab 1',
        content: '',
        order: 1,
      },
    ]);
    setActiveFileId(initialFileId);
    // --- END UPDATE ---
  };

  // Function to download QR Code
  const downloadQRCode = () => {
    const canvas = document.getElementById(
      'qr-code-canvas'
    ) as HTMLCanvasElement;
    if (!canvas) {
      toast.error('QR Code canvas element not found.');
      return;
    }
    try {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      const fileName = `qrcode-${
        createdPad?.customId || createdPad?.id || 'pad'
      }.png`;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code download started!');
    } catch (error) {
      console.error('Failed to download QR code:', error);
      toast.error('Failed to download QR Code.');
    }
  };

  // ===== SUCCESS VIEW =====
  if (showSuccess && createdPad) {
    return (
      <div className="md:py-8 md:px-4 rounded-lg h-fit">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Pad Created Successfully!
              </h2>
              <p className="text-gray-600">Your secure pad is ready to share</p>
            </div>

            {createdPad.customShareUrl && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom ID Link
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    value={createdPad.customShareUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all"
                  />
                  <Button
                    onClick={() =>
                      copyToClipboard(createdPad.customShareUrl, 'custom')
                    }
                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center sm:justify-start gap-1"
                  >
                    {copiedLink === 'custom' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    <span className="sm:hidden">
                      {copiedLink === 'custom' ? 'Copied' : 'Copy'}
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Shareable Link */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Shareable Link
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  value={createdPad.shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all"
                />
                <Button
                  onClick={() => copyToClipboard(createdPad.shareUrl, 'uuid')}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center sm:justify-start gap-1"
                >
                  {copiedLink === 'uuid' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                  <span className="sm:hidden">
                    {copiedLink === 'uuid' ? 'Copied' : 'Copy'}
                  </span>
                </Button>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Scan QR Code
              </label>
              <div className="flex justify-center mb-4">
                <QRCodeCanvas
                  id="qr-code-canvas"
                  value={createdPad.shareUrl}
                  size={160}
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  level={'L'}
                  includeMargin={false}
                />
              </div>
              <Button
                onClick={downloadQRCode}
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </Button>
            </div>

            {/* Summary */}
            <div className="bg-indigo-50 rounded-lg p-4 mb-6 space-y-2">
              <h3 className="font-semibold text-indigo-900 mb-3">
                Pad Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-indigo-700 font-medium">
                    Visibility:
                  </span>
                  <span className="ml-2 text-indigo-900">
                    {createdPad.visibility}
                  </span>
                  {createdPad.visibility === 'PUBLIC' && (
                    <span className="ml-2 text-indigo-900">
                      ({createdPad.isListed ? 'Listed' : 'Unlisted'})
                    </span>
                  )}
                </div>
                {createdPad.visibility !== 'PRIVATE' && (
                  <div>
                    <span className="text-indigo-700 font-medium">
                      Edit Access:
                    </span>
                    <span className="ml-2 text-indigo-900">
                      {createdPad.editPermission}
                    </span>
                  </div>
                )}
                {createdPad.encrypted && (
                  <div className="sm:col-span-2">
                    <span className="text-indigo-700 font-medium">
                      🔐 End-to-end encrypted
                    </span>
                  </div>
                )}
                {(createdPad.expiresAt ||
                  createdPad.maxViews ||
                  createdPad.burnAfterReading) && (
                  <div className="sm:col-span-2">
                    <span className="text-indigo-700 font-medium">
                      Expires:
                    </span>
                    <span className="ml-2 text-indigo-900">
                      {createdPad.burnAfterReading ? 'After first view' : ''}
                      {!createdPad.burnAfterReading && createdPad.maxViews
                        ? `After ${createdPad.maxViews} views`
                        : ''}
                      {!createdPad.burnAfterReading &&
                      createdPad.maxViews &&
                      createdPad.expiresAt
                        ? ' or '
                        : ''}
                      {!createdPad.burnAfterReading && createdPad.expiresAt
                        ? `On ${new Date(
                            createdPad.expiresAt
                          ).toLocaleDateString()}`
                        : ''}
                    </span>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <span className="text-indigo-700 font-medium flex items-center gap-1">
                    {createdPad.anonymityChoice === 'linked' && (
                      <>
                        <UserCheck className="w-4 h-4" /> Linked & Public
                        Username
                      </>
                    )}
                    {createdPad.anonymityChoice === 'publicly_anonymous' && (
                      <>
                        <UserX className="w-4 h-4" /> Linked & Hidden Username
                      </>
                    )}
                    {createdPad.anonymityChoice === 'completely_anonymous' && (
                      <>
                        <UserX className="w-4 h-4" /> Not Linked (Anonymous)
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Notices */}
            {(createdPad.linkOnlyAccess ||
              (createdPad.visibility === 'PUBLIC' && !createdPad.isListed)) && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold mb-1">Important Notice</p>
                    {createdPad.linkOnlyAccess && (
                      <p>
                        Anonymous access requires the secret share link. Save it
                        securely!
                      </p>
                    )}
                    {createdPad.visibility === 'PUBLIC' &&
                      !createdPad.isListed && (
                        <p>
                          This public pad is unlisted and won't appear on the
                          Explore page.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Create Another Pad
              </Button>
              <a
                href={createdPad.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                View Pad
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN FORM VIEW =====
  return (
    <div className="md:py-8 md:px-4 rounded-lg h-fit">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100"
        >
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" /> Basic Information
            </h2>
            {/* Title */}
            <div>
              <Label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Pad Title{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Secret Note"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* --- UPDATED: Content Section with Tabs --- */}
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-300 rounded-lg">
                {/* Tab Bar */}
                <div className="flex items-center border-b border-gray-300 bg-gray-50 rounded-t-lg overflow-x-auto">
                  {/* Only render tabs if client has hydrated */}
                  {isClient &&
                    files.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => setActiveFileId(file.id)}
                        className={`flex items-center border-b-2 cursor-pointer ${
                          activeFileId === file.id
                            ? 'border-indigo-600'
                            : 'border-transparent -mb-px'
                        }`}
                      >
                        <Input
                          id={`file-title-${file.id}`}
                          type="text"
                          value={file.title}
                          onChange={(e) =>
                            handleFileTitleChange(file.id, e.target.value)
                          }
                          placeholder="e.g., script.js or Tab 1"
                          className="py-3 px-2 h-auto text-sm font-medium border-0 border-transparent focus:ring-0 focus:border-indigo-600 focus:bg-indigo-50 rounded-none"
                        />
                        <button
                          type="button"
                          onClick={(e) => removeFile(e, file.id)}
                          className={`p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 ${
                            files.length <= 1 ? 'hidden' : 'inline-flex'
                          }`}
                          aria-label="Remove tab"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  {isClient && (
                    <button
                      type="button"
                      onClick={addFile}
                      className="p-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-tr-lg"
                      aria-label="Add new tab"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {/* Text Area for Active Tab */}
                <textarea
                  id="content"
                  value={activeFile?.content || ''}
                  onChange={(e) => {
                    if (activeFile) {
                      handleFileContentChange(activeFile.id, e.target.value);
                    }
                  }}
                  placeholder="Enter your note, code, or message here..."
                  rows={8}
                  required
                  maxLength={MAX_CONTENT_LENGTH}
                  className="w-full px-4 py-3 border-0 rounded-b-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm resize-y"
                  disabled={!isClient} // Disable until client loads
                />
              </div>
              {/* Character Counter for Active Tab */}
              {isClient && activeFile && (
                <p
                  className={`text-xs mt-1 ${
                    activeFile.content.length >= MAX_CONTENT_LENGTH
                      ? 'text-red-600 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  {activeFile.content.length.toLocaleString()} /{' '}
                  {MAX_CONTENT_LENGTH.toLocaleString()} characters (for this
                  tab)
                </p>
              )}
            </div>
            {/* --- END UPDATE --- */}

            {/* Custom ID */}
            <div>
              <Label
                htmlFor="customId"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Custom ID{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Input
                    id="customId"
                    type="text"
                    value={customId}
                    onChange={(e) =>
                      setCustomId(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      )
                    }
                    placeholder="my-custom-id"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                  />
                  {isCheckingId && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  )}
                  {!isCheckingId && idAvailable === true && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {!isCheckingId && idAvailable === false && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={generateRandomId}
                  variant="outline"
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center sm:justify-start gap-2 font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate
                </Button>
              </div>
              {idAvailable === false && (
                <p className="text-xs text-red-600 mt-1">
                  This ID is already taken
                </p>
              )}
              {idAvailable === true && (
                <p className="text-xs text-green-600 mt-1">
                  This ID is available!
                </p>
              )}
            </div>
          </div>

          {/* Privacy & Access */}
          <div className="space-y-6 mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" /> Privacy & Access
              Control
            </h2>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Visibility Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: 'PUBLIC',
                    label: 'Public',
                    icon: Globe,
                    desc: 'Anyone can view',
                  },
                  {
                    value: 'PROTECTED',
                    label: 'Protected',
                    icon: Lock,
                    desc: 'Requires access key',
                  },
                  {
                    value: 'PRIVATE',
                    label: 'Private',
                    icon: Shield,
                    desc: 'Creator only (Login Required)',
                  },
                ].map(({ value, label, icon: Icon, desc }) => {
                  const isDisabled = value === 'PRIVATE' && !isAuthenticated;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setVisibility(value as any)}
                      disabled={isDisabled}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${visibility === value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'} ${isDisabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                    >
                      <div className="flex items-center pl-2 gap-3">
                        <Icon
                          className={`w-5 h-5 flex-shrink-0 ${visibility === value ? 'text-indigo-600' : 'text-gray-400'} ${isDisabled ? 'text-gray-400' : ''}`}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {label}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Auth Warning for Private Pad */}
              {!isAuthenticated && visibility === 'PRIVATE' && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-900 text-sm">
                    <span className="font-semibold">
                      Authentication Required:
                    </span>{' '}
                    You must be logged in to create a "Private" pad.
                  </p>
                </div>
              )}
            </div>

            {/* Public Sharing Options (Conditional) */}
            {isAuthenticated && visibility === 'PUBLIC' && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Public Sharing Options
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setPublicSharingOption('listAndShow')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all text-left flex items-center gap-2 ${
                      publicSharingOption === 'listAndShow'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <SearchCheck
                      className={`w-5 h-5 flex-shrink-0 ${publicSharingOption === 'listAndShow' ? 'text-indigo-600' : 'text-gray-400'}`}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        List & Show Username
                      </div>
                      <div className="text-xs text-gray-600">
                        Discoverable, shows username, on dashboard.
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublicSharingOption('listAndHide')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all text-left flex items-center gap-2 ${
                      publicSharingOption === 'listAndHide'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <SearchCheck
                      className={`w-5 h-5 flex-shrink-0 ${publicSharingOption === 'listAndHide' ? 'text-indigo-600' : 'text-gray-400'}`}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        List & Hide Username
                      </div>
                      <div className="text-xs text-gray-600">
                        Discoverable, hides username, on dashboard.
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublicSharingOption('unlistAndAnonymous')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all text-left flex items-center gap-2 ${
                      publicSharingOption === 'unlistAndAnonymous'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <UserX
                      className={`w-5 h-5 flex-shrink-0 ${publicSharingOption === 'unlistAndAnonymous' ? 'text-indigo-600' : 'text-gray-400'}`}
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        Unlist & Don't Link
                      </div>
                      <div className="text-xs text-gray-600">
                        Not discoverable, hides username, hidden from dashboard.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Discoverability Toggle (for Non-Logged-In Public) */}
            {!isAuthenticated && visibility === 'PUBLIC' && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <Label
                    htmlFor="isListedToggle"
                    className="flex flex-col space-y-1 cursor-pointer pr-4 mb-2 sm:mb-0 items-start"
                  >
                    <span className="font-semibold text-gray-900">
                      Discoverability
                    </span>
                    <span className="font-normal leading-snug text-gray-600 text-sm">
                      Allow this pad to appear on the public Explore page?
                    </span>
                  </Label>
                  <Switch
                    id="isListedToggle"
                    checked={isListed}
                    onCheckedChange={setIsListed}
                    aria-readonly
                    className="flex-shrink-0"
                  />
                </div>
                {!isListed && (
                  <div className="mt-3 text-xs text-indigo-700 flex items-center gap-1.5">
                    <ListX className="w-3.5 h-3.5" /> Pad will be Public but
                    Unlisted.
                  </div>
                )}
                {isListed && (
                  <div className="mt-3 text-xs text-green-700 flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5" /> Pad will be Public and
                    Listed.
                  </div>
                )}
              </div>
            )}

            {/* Access Key (Only for PROTECTED) */}
            {visibility === 'PROTECTED' && (
              <div>
                <Label
                  htmlFor="accessKey"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Access Key <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="accessKey"
                    type={showAccessKey ? 'text' : 'password'}
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="Enter a strong passphrase"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAccessKey(!showAccessKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 h-auto w-auto px-0 py-0"
                  >
                    {showAccessKey ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Conditionally Render Editing Permissions */}
            {visibility !== 'PRIVATE' && (
              <>
                {/* Editing Permissions */}
                <div>
                  <Label
                    htmlFor="editPermission"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Who can edit this pad?
                  </Label>
                  <Select
                    value={editPermission}
                    onValueChange={(value: 'ANYONE' | 'ACCESS_KEY') =>
                      setEditPermission(value)
                    }
                  >
                    <SelectTrigger
                      id="editPermission"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <SelectValue placeholder="Select edit permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ANYONE">Anyone</SelectItem>
                      <SelectItem value="ACCESS_KEY">
                        Only with Access Key
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Edit Access Key */}
                {editPermission === 'ACCESS_KEY' && (
                  <div>
                    <Label
                      htmlFor="editAccessKey"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Edit Access Key <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="editAccessKey"
                      type="password"
                      value={editAccessKey}
                      onChange={(e) => setEditAccessKey(e.target.value)}
                      placeholder="Enter edit access key"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Advanced Features Toggle */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between mb-6 group h-auto font-semibold text-gray-700"
          >
            <span className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Advanced Features
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            )}
          </Button>

          {/* Advanced Features Content */}
          {showAdvanced && (
            <div className="space-y-6 mb-8 pb-8 border-b border-gray-200 animate-fadeIn">
              {/* Encryption */}
              <div className="flex items-start gap-3">
                <Switch
                  id="encryption"
                  checked={enableEncryption}
                  onCheckedChange={setEnableEncryption}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="encryption"
                    className="font-semibold text-gray-900 cursor-pointer"
                  >
                    🔐 Client-Side Encryption (AES-256)
                  </Label>
                  <p className="text-sm text-gray-600 mt-1 font-normal">
                    Content is encrypted in your browser. The encryption key
                    never leaves your device and is embedded in the share link.
                  </p>
                </div>
              </div>
              {/* Link-Only Access */}
              <div className="flex items-start gap-3">
                <Switch
                  id="linkOnly"
                  checked={linkOnlyAccess}
                  onCheckedChange={setLinkOnlyAccess}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="linkOnly"
                    className="font-semibold text-gray-900 cursor-pointer"
                  >
                    Require Secret Link for Anonymous Access
                  </Label>
                  <p className="text-sm text-gray-600 mt-1 font-normal">
                    If enabled, anonymous or unauthenticated users must use the
                    generated share link with the token. Authenticated owners
                    (Private) or users with the key (Protected) can still access
                    via ID.
                  </p>
                </div>
              </div>
              {/* Expiry Options */}
              <div>
                <Label
                  htmlFor="expiryType"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Expiry Settings
                </Label>
                <Select
                  value={expiryType}
                  onValueChange={(
                    value: 'NONE' | 'TIME' | 'VIEWS' | 'ONE_TIME'
                  ) => setExpiryType(value)}
                >
                  <SelectTrigger
                    id="expiryType"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all mb-3"
                  >
                    <SelectValue placeholder="Select expiry settings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Never Expire</SelectItem>
                    <SelectItem value="TIME">Time-Based Expiry</SelectItem>
                    <SelectItem value="VIEWS">View-Based Expiry</SelectItem>
                    <SelectItem value="ONE_TIME">
                      One-Time View (Burn After Reading)
                    </SelectItem>
                  </SelectContent>
                </Select>

                {expiryType === 'TIME' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="number"
                      value={expiryValue}
                      onChange={(e) => setExpiryValue(e.target.value)}
                      min="1"
                      placeholder="24"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <Select
                      value={expiryUnit}
                      onValueChange={(value: 'HOURS' | 'DAYS') =>
                        setExpiryUnit(value)
                      }
                    >
                      <SelectTrigger className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOURS">Hours</SelectItem>
                        <SelectItem value="DAYS">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {expiryType === 'VIEWS' && (
                  <Input
                    type="number"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    min="1"
                    placeholder="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
                {expiryType === 'ONE_TIME' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
                    ⚠️ This pad will be permanently deleted after the first view
                  </div>
                )}
              </div>
              {/* Disable Copy */}
              <div className="flex items-start gap-3">
                <Switch
                  id="disableCopy"
                  checked={disableCopy}
                  onCheckedChange={setDisableCopy}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="disableCopy"
                    className="font-semibold text-gray-900 cursor-pointer"
                  >
                    Disable Text Selection & Copying
                  </Label>
                  <p className="text-sm text-gray-600 mt-1 font-normal">
                    Prevents copying or selecting pad content (basic
                    obfuscation).
                  </p>
                </div>
              </div>
              {/* Generate Link */}
              <div className="flex items-start gap-3">
                <Switch
                  id="generateLink"
                  checked={generateLink}
                  onCheckedChange={setGenerateLink}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="generateLink"
                    className="font-semibold text-gray-900 cursor-pointer"
                  >
                    Show Share Link / QR After Creation
                  </Label>
                  <p className="text-sm text-gray-600 mt-1 font-normal">
                    Display a shareable link and QR code after pad creation.
                  </p>
                </div>
              </div>
              {/* Audit Settings */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  📊 Audit & Monitoring
                </h3>
                <div className="flex items-start gap-3">
                  <Switch
                    id="auditLogs"
                    checked={enableAuditLogs}
                    onCheckedChange={setEnableAuditLogs}
                    disabled={!isAuthenticated}
                    className={`mt-1 ${!isAuthenticated ? 'cursor-not-allowed opacity-80' : ''}`}
                  />
                  <Label
                    htmlFor="auditLogs"
                    className={`text-sm cursor-pointer ${!isAuthenticated ? 'text-gray cursor-not-allowed' : 'text-gray-700'}`}
                  >
                    Enable access logs for this pad{' '}
                    {!isAuthenticated && <>(Login required)</>}
                  </Label>
                </div>
                <div className="flex items-start gap-3 opacity-80 cursor-not-allowed">
                  <Switch
                    id="notifyView"
                    checked={false}
                    disabled
                    className="mt-1 cursor-not-allowed"
                  />
                  <Label
                    htmlFor="notifyView"
                    className="text-sm text-gray cursor-not-allowed"
                  >
                    Notify me when this pad is viewed (Coming Soon)
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || files.some((f) => !f.content.trim())} // --- UPDATED disable logic ---
              className="flex-1 px-8 py-4 h-auto bg-indigo-600 text-white rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Creating Pad...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Create Secure Pad
                </>
              )}
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>
              🔒 Your data is encrypted and secured. We never access your
              content.
              <br />
              By creating a pad, you agree to our terms of service.
            </p>
          </div>
        </form>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">
            💡 <strong>Tip:</strong> Use custom IDs for memorable links, or
            leave blank for auto-generated IDs
          </p>
          <p>
            🛡️ All pads are stored securely with industry-standard encryption
          </p>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreatePadForm;
