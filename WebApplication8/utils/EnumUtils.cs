public class EnumUtils
{
    public static Boolean isSelected(int toCheck, long allStates)
    {
        if (toCheck == 0) throw new Exception("toCheck in EnumUtils.isSelected cannt be 0");
        return (allStates & toCheck) == toCheck;
    }
}