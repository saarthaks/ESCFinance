import { MAIL_URL } from '../../../lib/constants.js';

import './postmaster.js';
import './accounts-management.js';
import '../../api/jccc-requests.js';
import '../../api/jccc-settings.js';
import '../../api/jccc-finances.js';
import '../../api/pg-budgets.js';

process.env.MAIL_URL = MAIL_URL;
