DEFINE TABLE user SCHEMAFULL
  PERMISSIONS
    FOR select FULL,
    FOR update WHERE id = $auth.id,
    FOR create, delete NONE;

DEFINE FIELD name ON user
  ASSERT string::trim($user) NOTINSIDE ["", "me", "www", "search", "admin", "login", "register"]
  PERMISSIONS
    FOR select FULL,
    FOR update WHERE id = $auth.id;
DEFINE FIELD email ON user TYPE string
  ASSERT is::email($value)
  PERMISSIONS
    FOR select WHERE id = $auth.id;
DEFINE FIELD password ON user TYPE string
  ASSERT $value != NONE
  PERMISSIONS
    FOR select NONE,
    FOR update WHERE id = $auth.id AND crypto::argon2::compare(password, $oldpassword);
DEFINE FIELD settings.* ON user TYPE object
  PERMISSIONS
    FOR select WHERE id = $auth.id;
DEFINE FIELD settings.marketing ON user TYPE bool
  ASSERT $value != NONE
  PERMISSIONS
    FOR select WHERE id = $auth.id;
DEFINE FIELD tags ON user TYPE array;
DEFINE INDEX idx_name ON user COLUMNS name UNIQUE;
DEFINE INDEX idx_email ON user COLUMNS email UNIQUE;

DEFINE SCOPE allusers
  SESSION 14d
  -- username, email, password, marketing
  SIGNUP (
    CREATE user
      SET
        name = string::lowercase(string::trim($username)),
        email = $email,
        password = crypto::argon2::generate($password),
        tags = [],
        settings.marketing = $marketing
  )
  -- [username|email], password
  SIGNIN (
    SELECT * FROM user
      WHERE (name = string::lowercase(string::trim($user)) OR email = $user)
        AND crypto::argon2::compare(password, $password)
  );

DEFINE TABLE post SCHEMAFULL
  PERMISSIONS
    FOR select WHERE draft = false OR owner = $auth.id,
    FOR create, update, delete WHERE owner = $auth.id;

DEFINE FIELD owner ON post TYPE record (user)
  VALUE $auth.id
  ASSERT $value = $auth.id
  PERMISSIONS
    FOR select, create FULL,
    FOR update, delete NONE;

DEFINE FIELD slug ON post TYPE string
  ASSERT $value != NONE AND count(string::trim($value)) > 0;

DEFINE FIELD title ON post TYPE string
  ASSERT $value != NONE AND count(string::trim($value)) > 0;

DEFINE FIELD content ON post TYPE string
  ASSERT $value != NONE AND count($value) > 0;

DEFINE FIELD draft ON post TYPE bool
  ASSERT $value != NONE;

DEFINE FIELD created_at ON post TYPE datetime
  VALUE time::now()
  PERMISSIONS
    FOR select FULL,
    FOR create, update, delete NONE;

DEFINE INDEX unique_owner_slug ON post COLUMNS owner, slug UNIQUE;

DEFINE EVENT post_create ON TABLE post WHEN $after.created_at = NONE THEN (
  UPDATE $this SET created_at = time::now()
);
