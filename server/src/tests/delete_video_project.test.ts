
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type DeleteVideoProjectInput } from '../schema';
import { deleteVideoProject } from '../handlers/delete_video_project';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: DeleteVideoProjectInput = {
  id: 1
};

describe('deleteVideoProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing video project', async () => {
    // First create a project to delete
    await db.insert(videoProjectsTable)
      .values({
        name: 'Test Project',
        description: 'A project for testing'
      })
      .execute();

    const result = await deleteVideoProject(testInput);

    // Should return success
    expect(result.success).toBe(true);

    // Project should no longer exist in database
    const projects = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, testInput.id))
      .execute();

    expect(projects).toHaveLength(0);
  });

  it('should throw error when project does not exist', async () => {
    // Try to delete non-existent project
    await expect(deleteVideoProject({ id: 999 }))
      .rejects.toThrow(/Video project with id 999 not found/i);
  });

  it('should remove the correct project when multiple exist', async () => {
    // Create multiple projects
    await db.insert(videoProjectsTable)
      .values([
        { name: 'Project 1', description: 'First project' },
        { name: 'Project 2', description: 'Second project' }
      ])
      .execute();

    // Delete project with id 1
    const result = await deleteVideoProject({ id: 1 });

    expect(result.success).toBe(true);

    // Project 1 should be gone
    const project1 = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, 1))
      .execute();
    expect(project1).toHaveLength(0);

    // Project 2 should still exist
    const project2 = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, 2))
      .execute();
    expect(project2).toHaveLength(1);
    expect(project2[0].name).toEqual('Project 2');
  });
});
