import { memo, FC, useEffect, useMemo } from 'react';
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { GamePreference } from '../components/GamePreference';
import { InviteState, useGameInvitation } from '../hooks/useGameInviting';

export const Inviting: FC = memo(() => {
  const { id } = useParams();
  const { inviteState, setInviteState, setOpponentId, setBallSpeed } =
    useGameInvitation();
  const onClickCancel = () => {
    setInviteState(InviteState.InvitingCancel);
  };

  useEffect(() => {
    if (id !== undefined) setOpponentId(id);
  }, []);

  const invitingPage = useMemo(() => {
    switch (inviteState) {
      case InviteState.SocketConnecting:
        return <CenterSpinner h="40vh" />;
      case InviteState.GamePreference:
        return (
          <GamePreference
            setInviteState={setInviteState}
            setBallSpeed={setBallSpeed}
          />
        );
      case InviteState.Inviting:
        // TODO: コンポーネントに分ける
        return (
          <Flex align="center" justify="center" height="40vh">
            <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
              <Heading as="h1" size="lg" textAlign="center">
                Now Inviting...
              </Heading>
              <Divider />
              <Stack spacing={4} py={4} px={10} align="center">
                <Spinner />
                <PrimaryButton onClick={onClickCancel}>Cancel</PrimaryButton>
              </Stack>
            </Box>
          </Flex>
        );
    }
  }, [inviteState, onClickCancel]);

  return (
    <ContentLayout title="">
      <Center>{invitingPage}</Center>
    </ContentLayout>
  );
});
