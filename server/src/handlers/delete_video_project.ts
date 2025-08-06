
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type DeleteVideoProjectInput } from '../schema';
import { eq } from 'drizzle-orm';

export async function deleteVideoProject(input: DeleteVideoProjectInput): Promise<{ success: boolean }> {
  try {
    // Check if the project exists first
    const existingProject = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, input.id))
      .execute();

    if (existingProject.length === 0) {
      throw new Error(`Video project with id ${input.id} not found`);
    }

    // Delete the project
    const result = await db.delete(videoProjectsTable)
      .where(eq(videoProjectsTable.id, input.id))
      .execute();

    return { success: true };
  } catch (error) {
    console.error('Video project deletion failed:', error);
    throw error;
  }
}
