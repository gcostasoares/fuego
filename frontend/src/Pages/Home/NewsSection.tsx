import { Articles } from "@/types/articles";
import { Col,  Container  } from "react-bootstrap";
import styled from "styled-components";
import { Box } from "../../Styles/StyledComponents";

export const NewsContainer = styled.section`
  padding: 2rem 1rem;
  background: #f4f4f4;
  z-index: 0;
  position: relative;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #cbcccd;
  padding-bottom: 15px;
`;

export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
`;

export const NewsLink = styled.a`
  color: #3ab54a;
  font-weight: bold;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`;

export const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 20px 0px 20px 0px;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    padding: 20px 0px 150px 0px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 20px 0px 50px 0px;
  }
`;

export const NewsImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
`;

export const NewsContent = styled.div`
  padding: 1rem 0px;
`;

export const NewsDate = styled.p`
  font-size: 0.85rem;
  color: #888;
  font-weight: 400;
`;

export const NewsTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

export const NewsDescription = styled.p`
  font-size: 0.95rem;
  font-weight: 400;
  color: #555;
`;

export const NewsLinkStyled = styled.a`
  color: #3ab54a;
  text-decoration: underline;
`;
interface INewsProps {
  articles: Articles[];
}
export const NewsSection = ({ articles }: INewsProps) => {
  return (
    <NewsContainer className="my-20">
      <Container>
        <h2 className="text-4xl font-bold">Nachrichten</h2>
        <NewsGrid>
          {articles.map((news) => (
            <Box key={news.id}>
              <NewsImage
                src={news.imagePath}
                alt={news.title}
                loading="lazy"
              />
              <NewsContent>
                <NewsDate>
                  {new Date(news.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </NewsDate>
                <NewsTitle>{news.title}</NewsTitle>
                <NewsDescription>{news.content}</NewsDescription>
                <NewsLinkStyled
                  target="_blank"
                  className="hover:text-[#303030]"
                  href={news.url}
                >
                  Mehr sehen
                </NewsLinkStyled>
              </NewsContent>
            </Box>
          ))}
        </NewsGrid>
      </Container>
    </NewsContainer>
  );
};
