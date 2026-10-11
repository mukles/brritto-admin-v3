import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Can } from "@/modules/auth";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { UsersTable } from "../components/users-table";
import { useUsers } from "../hooks/use-users";

const PAGE_SIZE = 10;

export function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useUsers({
    page,
    pageSize: PAGE_SIZE,
  });
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage who can access the admin panel."
        actions={
          <Can permission="users:write">
            <Button
              onClick={() => toast.info("Inviting users is not built yet.")}
            >
              <PlusIcon /> Invite user
            </Button>
          </Can>
        }
      />
      {error ? (
        <p className="text-sm text-destructive">Couldn't load users.</p>
      ) : (
        <>
          <UsersTable users={data?.data} skeletonRows={PAGE_SIZE} />
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {data ? `${total} users` : " "}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm tabular-nums">
                Page {page} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pageCount || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
