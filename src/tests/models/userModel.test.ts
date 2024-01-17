    /* eslint-disable @typescript-eslint/no-explicit-any */
    import bcrypt from "bcrypt";
    import UsersModel from "../../models/usersModel";
    import RedisService from "../../utils/redisService";
    import { closeDatabase, setupDatabase } from "../setup";

    jest.mock("../../utils/redisService");

    describe("UsersModel", () => {
    beforeAll(async () => {
        await setupDatabase();

        (RedisService.getInstance as jest.Mock).mockReturnValue({
        getClient: jest.fn(),
        });
    });

    afterAll(async () => {
        await closeDatabase();
    });

    beforeEach(async () => {
        await UsersModel.deleteMany({});
    });

    it("should hash password before saving", async () => {
        const userData: any = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        role: "user",
        };

        const user = new UsersModel(userData);
        await user.save();

        const isPasswordHashed = await bcrypt.compare(
        userData.password,
        user.password
        );
        expect(isPasswordHashed).toBe(false);
    });

    it("should compare passwords", async () => {
        const password = "password123";

        const user = new UsersModel({
        username: "testuser",
        email: "test@example.com",
        password: await bcrypt.hash(password, 12),
        role: "user",
        });

        const isMatch = await user.comparePassword(password);
        expect(isMatch).toBe(true);
    });

    it("should update changedPasswordAt on password change", async () => {
        const user = new UsersModel({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        role: "user",
        });

        await user.save();

        const newPassword = "newPassword123";
        user.password = newPassword;
        await user.save();

        expect(user.changedPasswordAt).toBeInstanceOf(Date);
    });

    it("should return false if password is incorrect", async () => {
        const password = "password";

        const user = new UsersModel({
        username: "testuser",
        email: "test@example.com",
        password: await bcrypt.hash(password, 12),
        role: "user",
        });

        const isMatch = await user.comparePassword("<PASSWORD>");
        expect(isMatch).toBe(false);
    });

    it("should return true if password is correct", async () => {
        const password = "XXXXXXXX";

        const user = new UsersModel({
        username: "XXXXXXXX",
        email: "test@example.com",
        password: await bcrypt.hash(password, 12),
        role: "user",
        });

        const isMatch = await user.comparePassword(password);
        expect(isMatch).toBe(true);
    });
    });
