
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type UpdateVideoProjectInput, type CreateVideoProjectInput } from '../schema';
import { updateVideoProject } from '../handlers/update_video_project';
import { eq } from 'drizzle-orm';

describe('updateVideoProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  let existingProject: any;

  beforeEach(async () => {
    // Create a test project to update directly via database
    const result = await db.insert(videoProjectsTable)
      .values({
        name: 'Original Project',
        description: 'Original description'
      })
      .returning()
      .execute();
    
    existingProject = result[0];
  });

  it('should update project name only', async () => {
    const updateInput: UpdateVideoProjectInput = {
      id: existingProject.id,
      name: 'Updated Project Name'
    };

    const result = await updateVideoProject(updateInput);

    expect(result.id).toEqual(existingProject.id);
    expect(result.name).toEqual('Updated Project Name');
    expect(result.description).toEqual(existingProject.description); // Should remain unchanged
    expect(result.created_at).toEqual(existingProject.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(existingProject.updated_at.getTime());
  });

  it('should update project description only', async () => {
    const updateInput: UpdateVideoProjectInput = {
      id: existingProject.id,
      description: 'Updated description'
    };

    const result = await updateVideoProject(updateInput);

    expect(result.id).toEqual(existingProject.id);
    expect(result.name).toEqual(existingProject.name); // Should remain unchanged
    expect(result.description).toEqual('Updated description');
    expect(result.created_at).toEqual(existingProject.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(existingProject.updated_at.getTime());
  });

  it('should update both name and description', async () => {
    const updateInput: UpdateVideoProjectInput = {
      id: existingProject.id,
      name: 'New Name',
      description: 'New description'
    };

    const result = await updateVideoProject(updateInput);

    expect(result.id).toEqual(existingProject.id);
    expect(result.name).toEqual('New Name');
    expect(result.description).toEqual('New description');
    expect(result.created_at).toEqual(existingProject.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(existingProject.updated_at.getTime());
  });

  it('should set description to null', async () => {
    const updateInput: UpdateVideoProjectInput = {
      id: existingProject.id,
      description: null
    };

    const result = await updateVideoProject(updateInput);

    expect(result.id).toEqual(existingProject.id);
    expect(result.name).toEqual(existingProject.name); // Should remain unchanged
    expect(result.description).toBeNull();
    expect(result.created_at).toEqual(existingProject.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated project to database', async () => {
    const updateInput: UpdateVideoProjectInput = {
      id: existingProject.id,
      name: 'Database Test Name'
    };

    const result = await updateVideoProject(updateInput);

    // Query database to verify update
    const projects = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].name).toEqual('Database Test Name');
    expect(projects[0].description).toEqual(existingProject.description);
    expect(projects[0].updated_at).toBeInstanceOf(Date);
    expect(projects[0].updated_at.getTime()).toBeGreaterThan(existingProject.updated_at.getTime());
  });

  it('should throw error when project does not exist', async () => {
    const updateInput: UpdateVideoProjectInput = {
      id: 99999,
      name: 'Non-existent Project'
    };

    await expect(updateVideoProject(updateInput)).rejects.toThrow(/video project with id 99999 not found/i);
  });

  it('should update only updated_at when no other fields provided', async () => {
    const updateInput: UpdateVideoProjectInput = {
      id: existingProject.id
    };

    const result = await updateVideoProject(updateInput);

    expect(result.id).toEqual(existingProject.id);
    expect(result.name).toEqual(existingProject.name);
    expect(result.description).toEqual(existingProject.description);
    expect(result.created_at).toEqual(existingProject.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(existingProject.updated_at.getTime());
  });
});
