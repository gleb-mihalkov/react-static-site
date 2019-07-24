import React, { FC } from 'react';
import trim from 'lodash/trim';
import moment from 'moment';

/**
 * Sample React component.
 */
export const Sample: FC = () => {
  const phrase = trim('it works!');
  const time = moment().format('HH:mm:ss');

  return <h1>At {time} {phrase}</h1>;
};
