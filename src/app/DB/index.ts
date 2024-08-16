import { USER_ROLE } from "../../modules/user/user.constant";
import { User } from "../../modules/user/user.model";
import config from "../config";

const superAdmin = {
  id: "S-0001",
  password: config.super_admin_password,
  email: "nahinrahman87@gmail.com",
  needPassWordChange: false,
  status: "in-progress",
  role: "superAdmin",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // check when database is connected super is exist
  const isSuperAdminExist = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExist) {
    await User.create(superAdmin);
  }
};
export default seedSuperAdmin;
