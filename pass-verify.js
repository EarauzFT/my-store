const bcrypt = require('bcrypt')

async function veryPassword() {
  const myPassword = 'admin 123 .202';
  const hash = '$2b$10$KgvtRHi9grbzQ4hgGW..0O3TFcRdWhr1/v7/5MIl//67FgNgQf.B.';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch)
}

veryPassword();

