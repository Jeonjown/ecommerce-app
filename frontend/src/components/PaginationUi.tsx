import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const PaginationUI = ({
  currentPage,
  totalPages,
  makePageHref,
}: {
  currentPage: number;
  totalPages: number;
  makePageHref: (page: number) => string;
}) => (
  <div className="mt-10 flex justify-center">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={makePageHref(currentPage - 1)} />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={makePageHref(i + 1)}
              isActive={currentPage === i + 1}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={makePageHref(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
);

export default PaginationUI;
