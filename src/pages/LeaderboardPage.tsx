import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadLeaderboards } from "../store/slices/leaderboardsSlice";
import { Leaderboards } from "../components/ui-components/Leaderboards";

export function LeaderboardPage() {
  const dispatch = useAppDispatch();
  const { leaderboards, isLoading } = useAppSelector(
    (state) => state.leaderboards
  );

  useEffect(() => {
    dispatch(loadLeaderboards());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Leaderboards users={leaderboards} isLoading={isLoading} />
    </div>
  );
}
