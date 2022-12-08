import { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { useFriendRequest } from 'hooks/api';
import { UserCardButton } from 'features/friends/components/atoms/UserCardButton';
import { UserCard } from 'features/friends/components/molecules/UserCard';

type Props = {
  users: User[];
};

export const RequestableUsersList: FC<Props> = (props) => {
  const { users } = props;
  const [userList, setUserList] = useState<User[]>(users);
  useEffect(() => {
    setUserList(users);
  }, [users]);

  const { requestFriend } = useFriendRequest();
  if (users === undefined) return <></>;
  const onClickRequest = async (id: string) => {
    await requestFriend({
      receiverId: id,
    });
    setUserList(userList.filter((user) => user.id !== id));
  };

  return (
    <Grid
      templateColumns={{
        md: 'repeat(1, 1fr)',
        lg: 'repeat(2, 1fr)',
      }}
      gap={6}
    >
      {userList.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          username={user.name}
          nickname={user.nickname}
          avatarImageUrl={user.avatarImageUrl}
          winRate={50}
          totalNumOfGames={100}
          buttons={
            <>
              <UserCardButton
                text="Request"
                id={user.id}
                onClick={async (id) => {
                  await onClickRequest(id);
                }}
              />
            </>
          }
        />
      ))}
    </Grid>
  );
};
