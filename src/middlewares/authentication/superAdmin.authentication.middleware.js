import { error } from "../../utills/responseWrapper.js";
import Jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import { getSuperAdminService } from "../../services/superAdmin.service.js";
import { StatusCodes } from "http-status-codes";

export async function superAdminAuthenticate(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token){
      return res.status(StatusCodes.UNAUTHORIZED).send(error(404, "Authorization token is required"));
    }
    const parsedToken = token.split(" ")[1];
    const decoded = Jwt.verify(parsedToken, config.accessTokenSecretKey);
    // if(decoded['role']!=='superAdmin'){
    //   return res.send(error(409,"Invalid super-admin token"))
    // }
    const _id = decoded.id;
    const superAdmin = await getSuperAdminService({_id});
    if (!superAdmin){
      return res.send(error(404, "Admin not exists"));
    }
    req.superAdminId = _id;
    next();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error(500, err.message));
  }
}
