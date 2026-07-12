export function requireRole(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });

        }


        const userRole = String(req.user.role).toLowerCase();


        const roles = allowedRoles.map(role =>
            String(role).toLowerCase()
        );


        if (!roles.includes(userRole)) {

            return res.status(403).json({
                success:false,
                message:"Insufficient permissions"
            });

        }


        next();

    };

}