export const orderBy = async (order): Promise<string> => {
  let orderStr = '';
  if (order === 'created') {
    orderStr = 'posting.createdAt';
  } else if (order === 'views') {
    orderStr = 'posting.views';
  } else if (order === 'likes') {
    orderStr = 'count';
  }

  return orderStr;
};
