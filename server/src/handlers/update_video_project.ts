
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type UpdateVideoProjectInput, type VideoProject } from '../schema';
import { eq } from 'drizzle-orm';

export const updateVideoProject = async (input: UpdateVideoProjectInput): Promise<VideoProject> => {
  try {
    // Check if project exists first
    const existing = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, input.id))
      .execute();

    if (existing.length === 0) {
      throw new Error(`Video project with id ${input.id} not found`);
    }

    // Build update object with only provided fields
    const updateData: Partial<typeof videoProjectsTable.$inferInsert> = {
      updated_at: new Date()
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    // Update the project
    const result = await db.update(videoProjectsTable)
      .set(updateData)
      .where(eq(videoProjectsTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Video project update failed:', error);
    throw error;
  }
};
