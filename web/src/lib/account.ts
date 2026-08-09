import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export const deleteUserAccountWeb = httpsCallable(functions, 'deleteUserAccountWeb');
