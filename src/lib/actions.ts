import date from 'date-fns';
import events from 'events';

const Emitter = new events.EventEmitter();

export const actions = {
  SIGNUP: 'signup',
  SIGNIN: 'signin',
  RECOVER_ACCOUNT: 'recover-account',
  RESET_PASSWORD: 'reset-password',
  CONFIRM_ACCOUNT: 'confirm-account',
};

export function fire(action: string, payload: any) {
  if (process.env.NODE_ENV === 'development') {
    const now = date.format('DD/MM/YYYY HH:mm:ss');

    // tslint:disable-next-line
    console.info(`[ACTION] "${action}" on ${now}`);
  }

  try {
    Emitter.emit(action, payload);
  } catch (e) {
    // ignore error
  }
}
