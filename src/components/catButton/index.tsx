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

import { useHistory } from '@docusaurus/router';
import { useRive } from '@rive-app/react-canvas';

export default function CatButton() {
  const history = useHistory();
  const { RiveComponent } = useRive({
    src: '/rive/cat_button.riv',
    stateMachines: 'State Machine 1',
    artboard: 'Get Started',
    autoplay: true,
    onStateChange: (e) => {
      if ((e.data as string[]).includes('appeared click ex')) {
        setTimeout(() => {
          history.push('/docs/getting-started/quick-start');
        }, 100);
      }
    },
  });

  return (
    <div style={{ height: '30vh', width: '40vw', maxWidth: '400px', zIndex: '100', marginBottom: '-8%', marginTop: '-5%' }}>
      <RiveComponent
        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      />
    </div>
  );
}
