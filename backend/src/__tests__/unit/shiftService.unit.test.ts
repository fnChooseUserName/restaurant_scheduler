import { StaffRole } from "@prisma/client";

import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import { assignStaffToShift, createShift } from "../../services/shiftService";

jest.mock("../../prisma/client", () => ({
  prisma: {
    shift: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn()
    },
    shiftAssignment: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn()
    },
    staffMember: {
      findUnique: jest.fn()
    }
  }
}));

const shiftCreate = prisma.shift.create as jest.MockedFunction<typeof prisma.shift.create>;
const shiftFindUnique = prisma.shift.findUnique as jest.MockedFunction<
  typeof prisma.shift.findUnique
>;
const staffFindUnique = prisma.staffMember.findUnique as jest.MockedFunction<
  typeof prisma.staffMember.findUnique
>;
const assignmentFindFirst = prisma.shiftAssignment.findFirst as jest.MockedFunction<
  typeof prisma.shiftAssignment.findFirst
>;

describe("shiftService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when validating shift times", () => {
    it("creates a shift when the end time is after the start time", async () => {
      const row = {
        id: 1,
        day: new Date("2026-03-15T00:00:00.000Z"),
        startTime: "09:00",
        endTime: "17:00",
        role: StaffRole.SERVER,
        createdAt: new Date(),
        updatedAt: new Date(),
        shiftAssignments: []
      };
      shiftCreate.mockResolvedValue(row as never);

      const result = await createShift({
        day: "2026-03-15",
        startTime: "09:00",
        endTime: "17:00",
        role: "SERVER"
      });

      expect(shiftCreate).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        id: 1,
        startTime: "09:00",
        endTime: "17:00"
      });
    });

    it("rejects when the end time is not after the start time", async () => {
      await expect(
        createShift({
          day: "2026-03-15",
          startTime: "10:00",
          endTime: "10:00",
          role: "SERVER"
        })
      ).rejects.toBeInstanceOf(AppError);

      await expect(
        createShift({
          day: "2026-03-15",
          startTime: "12:00",
          endTime: "09:00",
          role: "SERVER"
        })
      ).rejects.toMatchObject({
        message: "endTime must be after startTime",
        statusCode: 422
      });

      expect(shiftCreate).not.toHaveBeenCalled();
    });
  });

  describe("when assigning staff to a shift", () => {
    it("rejects with a conflict when that assignment already exists", async () => {
      shiftFindUnique.mockResolvedValue({
        id: 5,
        day: new Date(),
        startTime: "09:00",
        endTime: "17:00",
        role: StaffRole.SERVER,
        createdAt: new Date(),
        updatedAt: new Date()
      } as never);

      staffFindUnique.mockResolvedValue({
        id: 8,
        name: "X",
        role: StaffRole.SERVER,
        email: "x@y.com",
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date()
      } as never);

      assignmentFindFirst.mockResolvedValue({
        id: 99,
        staffMemberId: 8,
        shiftId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      } as never);

      await expect(assignStaffToShift(5, 8)).rejects.toMatchObject({
        statusCode: 409
      });
    });
  });
});
