import React, { ReactElement } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

export default function GoBack({
  onClick,
}: {
  onClick: React.MouseEventHandler;
}): ReactElement {
  return (
    <button title="go back" name="go back" type="button" onClick={onClick}>
      <IoIosArrowBack size={40} />
    </button>
  );
}
