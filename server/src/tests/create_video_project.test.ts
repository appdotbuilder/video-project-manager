
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { videoProjectsTable } from '../db/schema';
import { type CreateVideoProjectInput } from '../schema';
import { createVideoProject } from '../handlers/create_video_project';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateVideoProjectInput = {
  name: 'Test Video Project',
  description: 'A video project for testing'
};

// Test input with null description
const testInputWithNullDescription: CreateVideoProjectInput = {
  name: 'Another Test Project',
  description: null
};

describe('createVideoProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a video project with description', async () => {
    const result = await createVideoProject(testInput);

    // Basic field validation
    expect(result.name).toEqual('Test Video Project');
    expect(result.description).toEqual('A video project for testing');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a video project with null description', async () => {
    const result = await createVideoProject(testInputWithNullDescription);

    // Basic field validation
    expect(result.name).toEqual('Another Test Project');
    expect(result.description).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save video project to database', async () => {
    const result = await createVideoProject(testInput);

    // Query using proper drizzle syntax
    const videoProjects = await db.select()
      .from(videoProjectsTable)
      .where(eq(videoProjectsTable.id, result.id))
      .execute();

    expect(videoProjects).toHaveLength(1);
    expect(videoProjects[0].name).toEqual('Test Video Project');
    expect(videoProjects[0].description).toEqual('A video project for testing');
    expect(videoProjects[0].created_at).toBeInstanceOf(Date);
    expect(videoProjects[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create video projects with auto-generated timestamps', async () => {
    const result = await createVideoProject(testInput);

    // Verify timestamps are recent (within last 5 seconds)
    const now = new Date();
    const fiveSecondsAgo = new Date(now.getTime() - 5000);

    expect(result.created_at >= fiveSecondsAgo).toBe(true);
    expect(result.created_at <= now).toBe(true);
    expect(result.updated_at >= fiveSecondsAgo).toBe(true);
    expect(result.updated_at <= now).toBe(true);
  });
});
