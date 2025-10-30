import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Your NextAuth auth utility
import { prisma } from '@/lib/prisma'; // Your Prisma client
import { z } from 'zod';

// Define a schema for validating the name update
const updateNameSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long'),
});

/**
 * PATCH /api/user/profile
 * Updates the authenticated user's name.
 */
export async function PATCH(request: NextRequest) {
  try {
    // 1. Get the session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    // 2. Validate the request body
    const body = await request.json();
    const validation = updateNameSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message }, // <-- Fix: Changed .errors to .issues
        { status: 400 }
      );
    }

    const { name } = validation.data;

    // 3. Update the user in the database
    // FIX: Changed to lowercase 'user' to match your schema's @@map("users")
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating the profile.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/profile
 * Deletes the authenticated user's account and all associated data.
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Get the session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Use a transaction to delete all user-related data
    // This ensures that if one part fails, the whole operation is rolled back.
    await prisma.$transaction(async (tx) => {
      // a. Delete all pads created by the user
      // This is correct, based on @@map("pads")
      // This will also cascade-delete all related PadFile and AuditLog records.
      await tx.pad.deleteMany({
        where: { userId: userId },
      });

      // b. Delete associated NextAuth accounts (e.g., Google, GitHub links)
      // REMOVED: Your schema does not contain an 'Account' model.

      // c. Delete associated NextAuth sessions
      // REMOVED: Your schema does not contain a 'Session' model.

      // d. Finally, delete the user itself
      // FIX: Changed to lowercase 'user' to match your schema's @@map("users")
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting the account.' },
      { status: 500 }
    );
  }
}
