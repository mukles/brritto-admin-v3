import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { User, UserStatus } from "../types/user.types";

const STATUS_VARIANT = {
  active: "default",
  invited: "secondary",
  suspended: "destructive",
} as const satisfies Record<UserStatus, string>;

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

type UsersTableProps = {
  users?: User[];
  skeletonRows?: number;
};

export function UsersTable({ users, skeletonRows = 5 }: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            ? users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[user.status]}
                      className="capitalize"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {dateFormatter.format(new Date(user.createdAt))}
                  </TableCell>
                </TableRow>
              ))
            : Array.from({ length: skeletonRows }, (_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}
          {users?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
