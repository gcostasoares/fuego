interface IProps {
  children: TrustedHTML;
  titleTextAlign?: string;
}
export const SecHeadings = ({ children, titleTextAlign }: IProps) => {
  return (
    <p
      className={`text-5xl font-bold py-12 ${titleTextAlign || "text-center"}`}
      dangerouslySetInnerHTML={{ __html: children }}
    ></p>
  );
};
