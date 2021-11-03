/* global window */

import server from './lib/server';
import browser from './lib/browser';

if (typeof window !== 'undefined') {
    export default browser;
} else {
    export default server;
}