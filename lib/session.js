const { useSession } = require("next-auth/react");

export const fetchSession = () => {
  const { data: session } = useSession();
  return session;
};
