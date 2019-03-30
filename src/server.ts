import errorHandler from 'src/middlewares/errorHandler';
import app from 'src/app';

app.use(errorHandler);

const server = () => {
  app.on('ready', () => {
    app.listen(app.get('port'), () => {
      // tslint:disable-next-line
      console.log(
        '🚀 Api is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
      );
    });
  });
};

export default server();
