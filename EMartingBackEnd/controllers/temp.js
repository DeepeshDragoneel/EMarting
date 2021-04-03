const bcrypt = require('bcrypt');

/* bcrypt.hash("divya", 10)
.then((result) => {
    const res = result;
    console.log(res);
}) */

bcrypt
  .compare(
    "divya",
    "$2b$10$.6/rTUyyO.TBdJc/PVZKaewpo54rx6Ww2M13JuZJzuQ1NNkdIYNZu"
  )
  .then((result) => {
    console.log(result);
  });