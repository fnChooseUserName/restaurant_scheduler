import request from "supertest";

import { app } from "../../app";
import { prisma } from "../../prisma/client";

const hasDb = Boolean(process.env.DATABASE_URL);
const describeIntegration = hasDb ? describe : describe.skip;

describeIntegration("Shift HTTP routes", () => {
  beforeEach(async () => {
    await prisma.shiftAssignment.deleteMany();
    await prisma.shift.deleteMany();
    await prisma.staffMember.deleteMany();
  });

  describe("when creating a shift", () => {
    it("creates a shift when the body is valid", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .send({
          day: "2026-06-10",
          startTime: "08:00",
          endTime: "16:00",
          role: "SERVER"
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        day: "2026-06-10",
        startTime: "08:00",
        endTime: "16:00",
        role: "SERVER"
      });
      expect(res.body.data.assignments).toEqual([]);
    });

    it("returns validation errors when the time range is invalid", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .send({
          day: "2026-06-10",
          startTime: "10:00",
          endTime: "09:00",
          role: "SERVER"
        });
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/endTime|after/i);
    });
  });

  describe("when assigning staff to a shift", () => {
    it("adds the staff member to the shift and returns the updated shift", async () => {
      const staff = await request(app).post("/api/staff").send({
        name: "Assignee",
        role: "BARTENDER",
        email: "assignee@example.com"
      });
      const staffId = staff.body.data.id as number;

      const shift = await request(app)
        .post("/api/shifts")
        .send({
          day: "2026-07-01",
          startTime: "12:00",
          endTime: "20:00",
          role: "BARTENDER"
        });
      const shiftId = shift.body.data.id as number;

      const res = await request(app)
        .post(`/api/shifts/${shiftId}/assign`)
        .send({ staffMemberId: staffId });

      expect(res.status).toBe(201);
      expect(res.body.data.assignments).toHaveLength(1);
      expect(res.body.data.assignments[0].staffMember.id).toBe(staffId);
    });

    it("returns conflict when the same assignment is submitted again", async () => {
      const staff = await request(app).post("/api/staff").send({
        name: "Dup Test",
        role: "SERVER",
        email: "dup@example.com"
      });
      const staffId = staff.body.data.id as number;

      const shift = await request(app)
        .post("/api/shifts")
        .send({
          day: "2026-07-02",
          startTime: "09:00",
          endTime: "17:00",
          role: "SERVER"
        });
      const shiftId = shift.body.data.id as number;

      await request(app)
        .post(`/api/shifts/${shiftId}/assign`)
        .send({ staffMemberId: staffId });

      const res = await request(app)
        .post(`/api/shifts/${shiftId}/assign`)
        .send({ staffMemberId: staffId });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe("when removing an assignment", () => {
    it("removes the assignment and returns no content", async () => {
      const staff = await request(app).post("/api/staff").send({
        name: "Unassign",
        role: "HOST",
        email: "unassign@example.com"
      });
      const staffId = staff.body.data.id as number;

      const shift = await request(app)
        .post("/api/shifts")
        .send({
          day: "2026-08-01",
          startTime: "07:00",
          endTime: "15:00",
          role: "HOST"
        });
      const shiftId = shift.body.data.id as number;

      await request(app)
        .post(`/api/shifts/${shiftId}/assign`)
        .send({ staffMemberId: staffId });

      const res = await request(app).delete(
        `/api/shifts/${shiftId}/assign/${staffId}`
      );
      expect(res.status).toBe(204);

      const shiftAgain = await request(app).get(`/api/shifts/${shiftId}`);
      expect(shiftAgain.body.data.assignments).toEqual([]);
    });
  });
});
