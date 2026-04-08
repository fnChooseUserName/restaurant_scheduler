import request from "supertest";

import { app } from "../../app";
import { prisma } from "../../prisma/client";

const hasDb = Boolean(process.env.DATABASE_URL);
const describeIntegration = hasDb ? describe : describe.skip;

describeIntegration("Staff HTTP routes", () => {
  beforeEach(async () => {
    await prisma.shiftAssignment.deleteMany();
    await prisma.shift.deleteMany();
    await prisma.staffMember.deleteMany();
  });

  describe("when listing staff", () => {
    it("returns an empty list when no staff members exist yet", async () => {
      const res = await request(app).get("/api/staff");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });
  });

  describe("when creating a staff member", () => {
    it("creates and returns a staff member when the body is valid", async () => {
      const res = await request(app)
        .post("/api/staff")
        .send({
          name: "Test Server",
          role: "SERVER",
          email: "test.server@example.com",
          phone: "555-1111"
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        name: "Test Server",
        role: "SERVER",
        email: "test.server@example.com",
        phone: "555-1111"
      });
      expect(typeof res.body.data.id).toBe("number");
      expect(res.body.data.createdAt).toBeDefined();
    });

    it("returns validation errors when required fields are missing or invalid", async () => {
      const missingName = await request(app)
        .post("/api/staff")
        .send({
          role: "SERVER",
          email: "a@b.com"
        });
      expect(missingName.status).toBe(422);
      expect(missingName.body.success).toBe(false);

      const badEmail = await request(app)
        .post("/api/staff")
        .send({
          name: "X",
          role: "SERVER",
          email: "not-an-email"
        });
      expect(badEmail.status).toBe(422);
      expect(badEmail.body.success).toBe(false);

      const badRole = await request(app)
        .post("/api/staff")
        .send({
          name: "X",
          role: "INVALID_ROLE",
          email: "good@example.com"
        });
      expect(badRole.status).toBe(422);
      expect(badRole.body.success).toBe(false);
    });
  });

  describe("when loading a single staff member", () => {
    it("returns the staff member with shift assignments when they are linked to shifts", async () => {
      const staffRes = await request(app).post("/api/staff").send({
        name: "Linked Staff",
        role: "COOK",
        email: "linked@example.com"
      });
      const staffId = staffRes.body.data.id as number;

      const shiftRes = await request(app)
        .post("/api/shifts")
        .send({
          day: "2026-05-01",
          startTime: "09:00",
          endTime: "17:00",
          role: "COOK"
        });
      const shiftId = shiftRes.body.data.id as number;

      await request(app).post(`/api/shifts/${shiftId}/assign`).send({
        staffMemberId: staffId
      });

      const res = await request(app).get(`/api/staff/${staffId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.assignments).toHaveLength(1);
      expect(res.body.data.assignments[0].shift.id).toBe(shiftId);
    });

    it("returns not found when the id does not exist", async () => {
      const res = await request(app).get("/api/staff/999999");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("when updating a staff member", () => {
    it("updates the staff member and returns the new values", async () => {
      const created = await request(app).post("/api/staff").send({
        name: "Before",
        role: "HOST",
        email: "before@example.com"
      });
      const id = created.body.data.id as number;

      const res = await request(app)
        .put(`/api/staff/${id}`)
        .send({ name: "After" });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("After");
      expect(res.body.data.email).toBe("before@example.com");
    });
  });

  describe("when deleting a staff member", () => {
    it("returns no content and removes the record", async () => {
      const created = await request(app).post("/api/staff").send({
        name: "To Delete",
        role: "MANAGER",
        email: "delete.me@example.com"
      });
      const id = created.body.data.id as number;

      const del = await request(app).delete(`/api/staff/${id}`);
      expect(del.status).toBe(204);

      const again = await request(app).get(`/api/staff/${id}`);
      expect(again.status).toBe(404);
    });
  });
});
