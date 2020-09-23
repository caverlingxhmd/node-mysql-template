'use strict';

import project from "./project"

export default app => {
  app.get('/', (req, res, next) => {
    if (req.url === "/") {
      res.redirect('/swagger-ui/index.html');
    } else {
      next()
    }
  });

  app.use('/project', project);
}