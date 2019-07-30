import React, { FC } from 'react';
import { trim } from 'lodash';
import moment from 'moment';

import { Heading } from './Heading';
import { Text } from './Text';

/**
 * Sample React component.
 */
export const Sample: FC = () => {
  const phrase = trim('it works!');
  const time = moment().format('HH:mm:ss');

  return (
    <>
      <Heading>At {time} {phrase}</Heading>
      <Text>NODE_ENV: {process.env.NODE_ENV}</Text>
      <Text>FOO: {process.env.FOO}</Text>
    </>
  );
};
