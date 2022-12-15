import { FC, memo } from 'react';
import { Button, Flex, Heading } from '@chakra-ui/react';
import { useLogout, useProfile } from 'hooks/api';
import { Link, useNavigate } from 'react-router-dom';
import { UserAvatarContainer } from 'components/molecules/avatar/UserAvatarContainer';

export const UserNavigation: FC = memo(() => {
  const { logout } = useLogout();
  const { user } = useProfile();

  const navigate = useNavigate();

  const onClickLogout = async () => {
    await logout({});
    navigate('/');
  };

  return (
    <Flex p="5%" mt={4} align="center">
      <UserAvatarContainer size="sm" src={user.avatarImageUrl} id={user.id} />
      <Flex flexDir="column" ml={4}>
        <Link to="/app/profile">
          <Heading as="h3" size="sm">
            {user.nickname}
          </Heading>
        </Link>
        <Button size="xs" rounded="lg" onClick={onClickLogout} color="gray">
          Logout
        </Button>
      </Flex>
    </Flex>
  );
});
