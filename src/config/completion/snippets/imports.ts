/**
 * 导入语句代码片段
 */

import { CompletionItem } from '../types';

export const IMPORT_SNIPPETS: CompletionItem[] = [
    {
        name: 'import module',
        description: '导入模块',
        snippet: "import { ${1:module} } from '${2:@ohos/module}';",
    },
    {
        name: 'import hilog',
        description: '导入日志模块',
        snippet: "import hilog from '@ohos.hilog';",
    },
    {
        name: 'import router',
        description: '导入路由模块',
        snippet: "import router from '@ohos.router';",
    },
    {
        name: 'import preferences',
        description: '导入首选项模块',
        snippet: "import preferences from '@ohos.data.preferences';",
    },
    {
        name: 'import http',
        description: '导入 HTTP 模块',
        snippet: "import http from '@ohos.net.http';",
    },
];
