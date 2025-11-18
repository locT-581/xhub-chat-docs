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

import { useRive } from '@rive-app/react-canvas';

export default function FooterRive() {
  const { RiveComponent } = useRive({
    src: '/rive/happy_meeple.riv',
    stateMachines: 'Meeples',
    autoplay: true,
  });

  return (
    <div style={{ height: '15vh', width: '25vh', marginLeft: 'auto' }}>
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
