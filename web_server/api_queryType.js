const  confirmValidation = (username) => {
	let text = `
		SELECT 
			user_table.name, 
			user_table.password,
			roles.name as role,
			user_role.role_id as role_id,
			array (
				SELECT area_id
				FROM user_area
				WHERE user_area.user_id = user_table.id
			) as areas_id,
			(
				SELECT id
				FROM user_table
				WHERE user_table.name = $1
			) as user_id,
			ARRAY (
				SELECT role_id
				FROM user_role
				WHERE user_role.user_id = (
					SELECT id
					FROM user_table 
					WHERE user_table.name = '${username}'
				)
			) as roles

		FROM user_table

		LEFT JOIN user_role
		ON user_role.user_id = user_table.id

		LEFT JOIN roles
		ON user_role.role_id = roles.id
		
		LEFT JOIN user_area
		ON user_area.user_id = user_table.id
		
		WHERE user_table.name = $1;
	`

	const values = [username];

	const query = {
		text,
		values
	};

	return query;

}

function apiGetKey (name) { 
	let text = 
		` 
			SELECT  key
			FROM api_key
			WHERE name = $1
		`
	const values = [
		name
	];

	const query = {
		text,
		values
	};
    
	return query;
}

const get_all_key = () => { 
    const query = 
		` 
			SELECT  key
            FROM api_key 
		` 
	return query;
}

const search_by_mac_address  = (mac_address) => {   
    const query = 
    `
        DELETE FROM location_history_table
        WHERE mac_address IN (${mac_address.map(item => `'${item}'`)})
        RETURNING *;
    `    
    return query
}


module.exports = {
    confirmValidation,
    apiGetKey,
    get_all_key,
    search_by_mac_address
}