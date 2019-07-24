import React, { FC } from 'react';
import trim from 'lodash/trim';
import moment from 'moment';

import { Heading } from './Heading';

/**
 * Sample React component.
 */
export const Sample: FC = () => {
  const phrase = trim('it works!');
  const time = moment().format('HH:mm:ss');
  return <Heading>At {time} {phrase}</Heading>;
};
