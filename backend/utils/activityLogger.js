import db from "../db.js";

export function logActivity(userId, description) {

    db.prepare(`
        INSERT INTO activity_logs
        (
            user_id,
            action_description
        )
        VALUES (?, ?)
    `).run(
        userId,
        description
    );

}