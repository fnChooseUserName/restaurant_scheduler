import { prisma } from "../../prisma/client";
import { getStaffById } from "../../services/staffService";

jest.mock("../../prisma/client", () => ({
  prisma: {
    staffMember: {
      findUnique: jest.fn()
    }
  }
}));

const findUnique = prisma.staffMember.findUnique as jest.MockedFunction<
  typeof prisma.staffMember.findUnique
>;

describe("staffService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when loading a staff member by id", () => {
    it("throws a not-found error when Prisma returns no row", async () => {
      findUnique.mockResolvedValue(null);

      await expect(getStaffById(999)).rejects.toMatchObject({
        message: "Staff member not found",
        statusCode: 404
      });
    });
  });
});
