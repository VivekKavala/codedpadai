'use server';

import { CreatePadData, ApiResponse, Pad } from '@/lib/types';

// Mock data for development/testing
const mockPads: Pad[] = [
  {
    id: 'mock-1',
    title: 'Sample JavaScript Function',
    content: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));',
    visibility: 'PUBLIC',
    encrypted: false,
    views: 42,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'mock-2',
    title: 'API Endpoint Example',
    content: 'app.get("/api/users", (req, res) => {\n  res.json({ users: [] });\n});',
    visibility: 'PUBLIC',
    encrypted: false,
    views: 28,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
];

export async function createPad(data: CreatePadData, customId?: string): Promise<ApiResponse<Pad>> {
  try {
    // Simulate validation
    if (!data.title.trim() || !data.content.trim()) {
      return {
        success: false,
        error: 'Title and content are required',
      };
    }

    if (data.visibility === 'PROTECTED' && !data.passphrase?.trim()) {
      return {
        success: false,
        error: 'Passphrase is required for protected pads',
      };
    }

    // Check if pad with custom ID already exists
    if (customId) {
      const existingPad = mockPads.find(p => p.id === customId);
      if (existingPad) {
        return {
          success: false,
          error: 'A pad with this ID already exists',
        };
      }
    }

    // Create mock pad
    const newPad: Pad = {
      id: customId || `mock-${Date.now()}`,
      title: data.title.trim(),
      content: data.content.trim(),
      visibility: data.visibility,
      encrypted: data.encrypt || false,
      passphrase: data.passphrase ? 'hashed-passphrase' : undefined,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPads.unshift(newPad);

    return {
      success: true,
      data: newPad,
    };
  } catch (error) {
    console.error('Error creating pad:', error);
    return {
      success: false,
      error: 'Failed to create pad. Please try again.',
    };
  }
}

export async function getPad(id: string): Promise<ApiResponse<Pad>> {
  try {
    const pad = mockPads.find(p => p.id === id);

    if (!pad) {
      return {
        success: false,
        error: 'Pad not found',
      };
    }

    // Increment view count
    pad.views++;

    return {
      success: true,
      data: pad,
    };
  } catch (error) {
    console.error('Error fetching pad:', error);
    return {
      success: false,
      error: 'Failed to fetch pad',
    };
  }
}

export async function getPublicPads(limit: number = 20): Promise<ApiResponse<Pad[]>> {
  try {
    const publicPads = mockPads
      .filter(pad => pad.visibility === 'PUBLIC')
      .slice(0, limit);

    return {
      success: true,
      data: publicPads,
    };
  } catch (error) {
    console.error('Error fetching public pads:', error);
    return {
      success: false,
      error: 'Failed to fetch pads',
    };
  }
}
