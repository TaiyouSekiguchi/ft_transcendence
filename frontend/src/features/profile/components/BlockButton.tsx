import { memo, FC } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useIsBlockedUser, useUserBlock, useUserBlockCancel } from 'hooks/api';

type Props = {
  userId: string;
};

export const BlockButton: FC<Props> = memo((props) => {
  const { userId } = props;
  const { isBlockedUser } = useIsBlockedUser(userId);

  const queryKeys = [
    ['block-relations', { targetId: userId }],
    ['/users/me/blocks'],
  ];
  const { blockUser } = useUserBlock(queryKeys);
  const { cancelUserBlock } = useUserBlockCancel(queryKeys);

  const onClickBlock = async () => {
    await blockUser({ targetId: userId });
  };

  const onClickCancelBlock = async () => {
    await cancelUserBlock(userId);
  };

  return (
    <Box>
      <Flex justify="center" align="center">
        <Button
          size="sm"
          onClick={isBlockedUser ? onClickCancelBlock : onClickBlock}
        >
          {isBlockedUser ? 'unblock' : 'block'}
        </Button>
      </Flex>
    </Box>
  );
});
