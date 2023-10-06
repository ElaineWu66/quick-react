const Courses = ({course}) => (
    <table>
      <tbody>
        <tr><th>term</th><td>{user.firstName} {user.lastName}</td></tr>
        <tr><th>number</th><td>{user.email}</td></tr>
        <tr><th>meets</th><td>{user.phone}</td></tr>
        <tr>
          <th>Address</th>
          <td>
            {user.address.address}, {user.address.city}, {user.address.state} {user.address.postalCode}
          </td>
        </tr>
      </tbody>
    </table>
  );
  
  export default UserContact;