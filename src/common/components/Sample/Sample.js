import React from 'react';
import { trim } from 'lodash';
import moment from 'moment';

import style from './Sample.scss';

/**
 * Sample React component.
 */
export const Sample = () => {
  const phrase = trim('it works!');
  const time = moment().format('HH:mm:ss');

  return (
    <div className={style.root}>
      <h1 className={style.heading}>At {time} {phrase}</h1>
      <p className={style.text}>NODE_ENV: {process.env.NODE_ENV}</p>
    </div>
  );
};
