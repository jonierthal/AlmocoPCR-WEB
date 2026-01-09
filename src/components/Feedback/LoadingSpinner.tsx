import { ColorRing } from 'react-loader-spinner';

import { TextAlertContainer } from './styles';

export function LoadingSpinner() {
  return (
    <TextAlertContainer>
      <ColorRing
        visible={true}
        height="60"
        width="60"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
    </TextAlertContainer>
  );
}