import { error } from "../../utills/responseWrapper.js";
import Jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import { getParentService } from "../../services/parent.services.js";

export async function parentAuthenticate(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.send(error(404, "Authorization token is required"));
    }
    const parsedToken = token.split(" ")[1];
    const decoded = Jwt.verify(parsedToken, config.accessTokenSecretKey);
    // if(decoded['role']!=='parent'){
    //   return res.send(error(409,"Invalid parent token"))
    // }
    const _id = decoded.parentId;
    const parent = await getParentService({_id});
    if (!parent) {
      return res.send(error(404, "Parent doesn't exists"));
    }
    req.parentId = decoded.parentId;
    req.adminId = decoded.adminId;
    req.role = "parent";
    next();
  } catch (err) {
    return res.send(error(500, err.message));
  }
}
