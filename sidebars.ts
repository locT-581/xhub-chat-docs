/*
Copyright 2025 TekNix Corporation

This software is proprietary and confidential to TekNix Corporation.
All rights reserved. No part of this software may be reproduced, distributed,
or transmitted in any form or by any means, including photocopying, recording,
or other electronic or mechanical methods, without the prior written permission
of TekNix Corporation, except in the case of brief quotations embodied in
critical reviews and certain other noncommercial uses permitted by copyright law.

For permission requests, write to TekNix Corporation at the address below:
TekNix Corporation
Legal Department

UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS STRICTLY PROHIBITED.
*/

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 */
const sidebars: SidebarsConfig = {
  // Getting Started Sidebar
  gettingStartedSidebar: [
    {
      type: 'category',
      label: '🚀 Getting Started',
      collapsible: false,
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/requirements',
      ],
    },
  ],

  // Core Concepts Sidebar
  coreConceptsSidebar: [
    {
      type: 'category',
      label: '💡 Core Concepts',
      collapsible: false,
      items: [
        'core-concepts/overview',
        'core-concepts/architecture',
        'core-concepts/design-philosophy',
        'core-concepts/faq',
      ],
    },
  ],

  // API Reference Sidebar
  apiSidebar: [
    {
      type: 'category',
      label: '📘 API Reference',
      collapsible: false,
      items: [
        'api/reference',
        'api/hooks',
        'api/classes',
        'api/utils',
        'api/config',
      ],
    },
  ],

  // Guides Sidebar
  guidesSidebar: [
    {
      type: 'category',
      label: '📚 Guides',
      collapsible: false,
      items: [
        'guides/using-with-react',
        'guides/integration-examples',
        'guides/troubleshooting',
        'guides/performance-tips',
      ],
    },
  ],

  // Packages Sidebar - NEW!
  packagesSidebar: [
    {
      type: 'category',
      label: '📦 Packages',
      collapsible: false,
      items: [
        'packages/overview/index',
        {
          type: 'category',
          label: '🎯 @xhub-chat/core',
          collapsible: true,
          items: [
            'packages/core/index',
            'packages/core/api',
            {
              type: 'category',
              label: 'Guides',
              items: [
                'packages/core/guides/storage',
                'packages/core/guides/events',
                'packages/core/guides/sync',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '⚛️ @xhub-chat/react',
          collapsible: true,
          items: [
            'packages/react/index',
            'packages/react/hooks',
            'packages/react/provider',
            {
              type: 'category',
              label: 'Guides',
              items: [
                'packages/react/guides/provider',
                'packages/react/guides/state-management',
                'packages/react/guides/nextjs',
              ],
            },
          ],
        },
      ],
    },
  ],

  // Features Sidebar - NEW!
  featuresSidebar: [
    {
      type: 'category',
      label: '🎯 Features',
      collapsible: false,
      items: [
        'features/index',
        {
          type: 'category',
          label: '📬 Messaging',
          collapsible: true,
          items: [
            'features/messaging/room-list',
            'features/messaging/send-receive',
            'features/messaging/unread-count',
          ],
        },
        {
          type: 'category',
          label: '📝 Posts',
          collapsible: true,
          items: [
            'features/posts/view-posts',
            'features/posts/like-unlike',
            'features/posts/comments',
            'features/posts/reply-like-comments',
          ],
        },
        {
          type: 'category',
          label: '🎬 Reels',
          collapsible: true,
          items: [
            'features/reels/index',
            'features/reels/reels-feed',
            'features/reels/reel-player',
            'features/reels/reel-comments',
          ],
        },
      ],
    },
  ],

  // Platforms Sidebar
  platformsSidebar: [
    {
      type: 'category',
      label: '📦 Platforms',
      collapsible: false,
      items: [
        'platforms/core',
        'platforms/react',
      ],
    },
  ],

  // Advanced Sidebar
  advancedSidebar: [
    {
      type: 'category',
      label: '🔧 Advanced',
      collapsible: false,
      items: [
        'advanced/plugin-system',
        'advanced/architecture-deep-dive',
        'advanced/lifecycle',
      ],
    },
  ],

  // Examples Sidebar
  examplesSidebar: [
    {
      type: 'category',
      label: '💻 Examples',
      collapsible: false,
      items: [
        'examples/minimal-example',
        'examples/custom-provider',
        'examples/full-app',
      ],
    },
  ],
};

export default sidebars;
