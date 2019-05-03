import app from 'src/app';
import errorHandler from 'src/middlewares/errorhandler';

app.use(errorHandler);

const server = () => {
  app.on('ready', () => {
    app.listen(app.get('port'), () => {
      const icon = () => {
        switch (app.get('env')) {
          case 'development':
            return '🔧';
          case 'bdd':
            return '📝';
          case 'staging':
          case 'production':
          default:
            return '🚀';
        }
      };

      // tslint:disable-next-line
      console.log(
        '%s Api is running in %s mode at http://localhost:%d',
        icon(),
        app.get('env'),
        app.get('port')
      );
    });
  });
};

export default server();
