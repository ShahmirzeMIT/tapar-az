import { Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Axtardığınız səhifə tapılmadı."
      extra={<Link to="/" className="text-ink dark:text-white underline">Ana səhifəyə qayıt</Link>}
    />
  );
}
